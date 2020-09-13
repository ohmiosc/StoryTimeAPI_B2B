const fetch = require("node-fetch");
const buildUrl = require("build-url");

const baseUrl = process.env.KANTOO_CLIENT_API_URL;

// Perform a HTTP request to the server
async function http(method, url, body = {}) {
    let realUrl = buildUrl(baseUrl, {
        path: url
    });

    let fetchData = { method: method };

    switch (method) {
        case "POST":
            fetchData.body = JSON.stringify(body);
            fetchData.headers = {"content-type": "application/json"};
            break;

        case "GET":
            fetchData.qs = JSON.stringify(body);
            realUrl = realUrl.concat(Object.values(body).map( i => `${i}/`).join(''));
            fetchData.headers = { "Content-Type": "application/json" };
            break
    }

    const res = await fetch(realUrl, fetchData);
    const json = await res.json();

    console.log("Response = ", json);

    return {
        status: res.status,
        headers: res.headers.raw(),
        body: json
    };
}

module.exports = {
    http: http
};
