const { setWorldConstructor } = require("cucumber");
const requester = require("./requester");

const dbCleaner = require("./dbCleaner");
const dbOperator = require("./dbOperator");

class CustomWorld {
    constructor() {
        this.lastResponse = undefined;
        this.user = undefined;
        this.environment = process.env.TF_VAR_env_name; // dev, prod, qa
        this._cleaner = new dbCleaner(this.environment);
        this._operator = new dbOperator();
    }

    async apiCall(method, path, body) {
        this.lastResponse = await requester.http(method, path, body);
        return this.lastResponse;
    }

    getLastResponse() {
        return this.lastResponse;
    }

    getRandomDeviceId() {
        const s = "0123456789abcdefghjklmnopqrstABCDEFGHJKLMNOPQRSTXZWYU";
        const hash = [...Array(17).keys()].map(() => s.charAt(Math.floor(Math.random() * s.length))).join("");
        return `auto_test_id_${hash}`;
    }

    async launchApplication() {
        const response = await this.apiCall("POST", "/appuser/launchapplication", {
            appUserID: "",
            productID: "disneystorytime",
            deviceID: 'auto-test-launch-application-deviceID',
            appVersion: "1.0",
            deviceOS: "android-8",
            platform: "android",
            deviceModel: "Samsung S6"
        });

        console.log('Launch Api response = ', JSON.stringify(response.body));

        this.user = {
            appUserID: response.body.appUserID,
            deviceID: response.body.deviceID,
            userType: response.body.userType,
            productID: response.body.productID,
            sessionID: response.body.sessionID
        };
    }

    async launchApplicationWithIPNonOperator() {
        const response = await this.apiCall("POST", "/appuser/launchapplication", {
            productID: "disneystorytime",
            deviceID: this.getRandomDeviceId(), //"883f69b1fd9af8caad11fd53e273d78c",
            ipAddress: "8.8.8.8"
        });

        this.user = {
            appUserID: response.body.appUserID,
            deviceID: response.body.deviceID,
            userType: response.body.userType,
            productID: response.body.productID
        };
    }

    async launchApplicationAsPeruUser() {
        const response = await this.apiCall("POST", "/appuser/launchapplication", {
            productID: "disneystorytime",
            deviceID: this.getRandomDeviceId(), //"883f69b1fd9af8caad11fd53e273d78c",
            ipAddress: "5.53.3.32"
        });

        this.user = {
            appUserID: response.body.appUserID,
            deviceID: response.body.deviceID,
            userType: response.body.userType,
            productID: response.body.productID
        };
    }

    async alternativeLogin(){
        const response = await this.apiCall("POST", "/appuser/loginalternative",  {
            "productID": this.user.productID,
            "deviceID": this.user.deviceID,
            "appUserID": this.user.appUserID,
            "MSISDN": "44444450013",
            "operatorName": "Vivo"
        });
        this.user = {
            appUserID: response.body.appUserID,
            deviceID: response.body.deviceID,
            userType: response.body.userType,
            productID: response.body.productID
        };
    }

    setVariables(template) {
        let m = null;
        const re = /\$\{([^\}]+)\}/gi;

        do {
            m = re.exec(template);
            if (!m) break;

            const param = m[1];
            const parts = param.split(".");

            let val = this;

            for (var i = 0; i < parts.length; i++) {
                const key = parts[i];
                val = val[key];
            }

            if (typeof val === "string" || val instanceof String) {
                val = `"${val}"`;
            }

            template = template.replace(`\$\{${param}\}`, val);
        } while (m);

        return template;
    }

    async clean() {
        if (this.environment === "prod") return;
        if (!this.user) {
            console.log("No User found");
            return
        }

        await this._cleaner.deleteItemFromDb(this.user.deviceID);
    }

    async signup() {

        const email = "test@test.com";
        const password = "Something3";

        const response = await this.apiCall("POST", "/appuser/signup",  {
            "productID": this.user.productID,
            "deviceID": this.user.deviceID,
            "appUserID": this.user.appUserID,
            "registrationType": 1,
            "email": email,
            "password": password
        });

        this.user = {
            appUserID: response.body.appUserID,
            deviceID: response.body.deviceID,
            userType: response.body.userType,
            productID: response.body.productID,
            email: email,
            password: password
        };

        console.log('Sign up response = ', JSON.stringify(response.body));

    }

    async sendIAPReceipt(){
        const response = await this.apiCall("POST", "/appuser/sendiapreceipt",  {
            "productID": this.user.productID,
            "deviceID": this.user.deviceID,
            "appUserID": this.user.appUserID,
            "appsFlyerID": "ewrkhg32h4v4b23vn4",
            "package": {
                "storeID": 2,
                "productID": "launch_lifetime_299",
                "productType": 3,
                "transactionID": "9191976592590172960.1857763235915559",
                "receipt": "{\"Store\":\"GooglePlay\",\"TransactionID\":\"9191976592590172960.1857763235915559\",\"Payload\":\"{\\\"json\\\":\\\"{\\\\\\\"orderId\\\\\\\":\\\\\\\"9191976592590172960.1857763235915559\\\\\\\",\\\\\\\"packageName\\\\\\\":\\\\\\\"com.LaMark.DisneyStorytime\\\\\\\",\\\\\\\"productId\\\\\\\":\\\\\\\"launch_ft_yearly_94.99\\\\\\\",\\\\\\\"purchaseTime\\\\\\\":1553917621968,\\\\\\\"purchaseState\\\\\\\":0,\\\\\\\"developerPayload\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"developerPayload\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"is_free_trial\\\\\\\\\\\\\\\":false,\\\\\\\\\\\\\\\"has_introductory_price_trial\\\\\\\\\\\\\\\":false,\\\\\\\\\\\\\\\"is_updated\\\\\\\\\\\\\\\":false}\\\\\\\",\\\\\\\"purchaseToken\\\\\\\":\\\\\\\"akkbgmhjfhhgofmjhmcgophd.AO-J1OzFoTnmqio7hdQKHdB2qgiPfXwZVCyAH174N5yKPndGORW4aZO3WGK0PKtLxrtv9p0wQjaYOYACJnKords_OUlS4k2H1104xblHo1bYc1T__WwaXL-McG-oUeHRpOUjuCyUpkFaSaPImUjQER1NJBWMURYNZg\\\\\\\"}\\\",\\\"signature\\\":\\\"Zh6ny7iG7wLvONKoy9lYtr190TNjcbkf4UxW0jT9APk87CgH2f7KKK5uO6VdqQSWUIceJdu87IO7XLjttBU1H5\\\\/j7R\\\\/nOFoqOw3vFI2jY\\\\/l9fXJUlRmb1MRVXPkiMOuopDz\\\\/80PqiU0f+OFW2wLu0CT\\\\/ffT0fIm3XyikKtDbjbGYXwgFdQaUwzTg8OCL5rcxmiqKusFY3YaAk\\\\/iXEpV2Cng3Eeym33NjKhqF7iOnV4gnmHVgp0Pi4DPjVFvB4ZQbd1RAaiTXjQUGxY3l7zqS7YgkZjq4MazOE\\\\/8b2rt9LEJ83s6h4Z1sfZ5AByp9qn8pbYv5s+Y8mCrTyBD0YJd8Ew==\\\",\\\"skuDetails\\\":\\\"{\\\\\\\"productId\\\\\\\":\\\\\\\"launch_lifetime_299\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"inapp\\\\\\\",\\\\\\\"price\\\\\\\":\\\\\\\"0.60\\\\\\\",\\\\\\\"title\\\\\\\":\\\\\\\"launch lifetime 299\\\\\\\",\\\\\\\"description\\\\\\\":\\\\\\\"launch lifetime 299\\\\\\\",\\\\\\\"price_amount_micros\\\\\\\":60000000,\\\\\\\"price_currency_code\\\\\\\":\\\\\\\"USD\\\\\\\"}\\\",\\\"isPurchaseHistorySupported\\\":true}\"}",
                "isoCurrencyCode": "USD",
                "localizedPrice": "0.60",
                "purchaseDate": "",
                "subscriptionData": {
                    "isFreeTrial": 0,
                    "remainingTime": "",
                    "isIntroductoryPricePeriod": 0,
                    "introductoryPricePeriod": "",
                    "introductoryPricePeriodCycles": 0,
                    "introductoryPrice": "",
                    "expireDate": ""
                }
            }
        });

        console.log('Send IAP Receip Api response = ', JSON.stringify(response.body));

        this.user = {
            appUserID: response.body.appUserID,
            deviceID: response.body.deviceID,
            userType: response.body.userType,
            productID: response.body.productID

        };
    }


    async cleanByID(itemId, tableName, indexName) {
        if (this.environment === "prod") return;

        const name = indexName ? indexName : "id";

        await this._cleaner.deleteItemFromDbById(itemId, this.environment + "_" + tableName, name);
    }

    async getItemFromTableById(tableName, itemID) {
       const item = await this._operator.getItemFromTableByID(`${this.environment}_${tableName}`, itemID);
        return item;
    }
}

setWorldConstructor(CustomWorld);
