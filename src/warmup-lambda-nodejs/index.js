const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();

/**
 * Comma separated list of functions to call
 * 
 * Examples:
 * - dev-LaunchApplication
 * - LaunchApplication
 * - LaunchApplication:dev-*
 * - LaunchApplication:dev-501
 * - dev-LaunchApplication, StepFunctionLaunch:dev-5* 
 */
const functionsList = strToArr(process.env.FUNCTIONS); // 

/**
 * Number of simultaneous calls of one function
 */
const simCalls = parseInt(process.env.SIMULTANEOUS_CALLS, 10) || 1;

const maxItems = 100;

function strToArr(value, separator = ",") {
    return [...new Set(value ? value.split(separator).map(x => x.trim()) : [])];
}

const getCurrentEnv = (env = "dev") => {
    const environments = {
        qa: /^(qa)/,
        dev: /^(dev)/,
        prod: /^(prod)/
    };
    return environments[env];
};

const getLatestVersion = (aliases, regex) => {
    let filteredAliases = aliases.filter(i => {
        return i["Name"].match(regex);
    });

    if (filteredAliases.length > 0) {
        return filteredAliases.reduce((prev, current) => {
            if (parseInt(prev.FunctionVersion, 10) < parseInt(current.FunctionVersion, 10)) {
                return current;
            }
            return prev;
        });
    }

    return undefined;
};

const getLatestVersions = aliases => {
    return [getLatestVersion(aliases, getCurrentEnv("dev")), getLatestVersion(aliases, getCurrentEnv("qa")), getLatestVersion(aliases, getCurrentEnv("prod"))].filter(x => !!x);
};

const invokeLambda = async arn => {
    const paramsForInvoke = {
        FunctionName: arn,
        InvocationType: "Event",
        Payload: JSON.stringify({ WARM_UP_INVOCATION__: true })
    };

    try {
        // console.log(`Invoking function: ${arn}`);

        const res = await lambda.invoke(paramsForInvoke).promise();

        console.log(`Function invoked: ${arn}: ${res.StatusCode}`);
    } catch (e) {
        console.exception(e);
    }
};

const getAllFunctions = async () => {
    let items = [];
    let params = { MaxItems: maxItems };
    let response;

    do {
        response = await lambda.listFunctions(params).promise();
        items = [...items, ...response["Functions"]];
        params["Marker"] = response["NextMarker"];
    } while (response["NextMarker"] !== null);

    // console.log(`Functions found: ${items.length}`);

    return items;
};

const getLambdaVersions = async func => {
    let items = [];
    let params = { FunctionName: func.FunctionArn, MaxItems: maxItems };
    let response;

    do {
        response = await lambda.listAliases(params).promise();
        items = [...items, ...response["Aliases"]];
        params["Marker"] = response["NextMarker"];
    } while (response["NextMarker"] !== null);

    // console.log(`${func.FunctionArn} aliases found: ${items.length}`);

    return items;
};

/**
 *
 */
class LambdaFunc {
    constructor(name, func, aliasPattern) {
        this._name = name;
        this._func = func;
        this._arns = [];

        this._aliasPattern = aliasPattern ? new RegExp("^" + aliasPattern.split("*").join(".*") + "$") : undefined;
    }

    /**
     *
     */
    async findArns() {
        const self = this;
        let aliases = await getLambdaVersions(this._func);

        if (aliases.length > 0) {
            if (this._aliasPattern) {
                aliases = aliases.filter(x => this._aliasPattern.test(x.Name));
            }

            const latestVersions = getLatestVersions(aliases);

            latestVersions.forEach(x => self._arns.push(x.AliasArn));
        } else {
            if (!this._aliasPattern) {
                this._arns.push(this._func.FunctionArn);
            }
        }
    }

    /**
     *
     */
    async invoke() {
        for (var x in this._arns) {
            const arn = this._arns[x];
            const promises = [];

            for (var i = 0; i < simCalls; i++) {
                promises.push(invokeLambda(arn));
            }

            try {
                await Promise.all(promises);
            } catch (e) {
                console.error(e.toString());
            }
        }
    }
}

/**
 *
 */
exports.handler = async () => {
    try {
        const functions = await getAllFunctions();

        const funcs = functionsList
            .map(x => {
                const parts = x.split(":");

                const name = parts[0];
                const func = functions.find(n => n.FunctionName === name);

                if (!func) {
                    console.warn(`Function with name "${name}" not found!`);
                    return undefined;
                }

                const aliasPattern = parts.length > 1 ? parts[1] : undefined;
                return new LambdaFunc(name, func, aliasPattern);
            })
            .filter(x => !!x);

        for (var i in funcs) {
            await funcs[i].findArns();
        }

        for (var i in funcs) {
            await funcs[i].invoke();
        }
    } catch (e) {
        console.log(`Warmup failed: ${e}`);
    }
};
exports.handler();
