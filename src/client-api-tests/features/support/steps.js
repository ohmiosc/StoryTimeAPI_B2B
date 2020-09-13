const { Given, When, Then, setDefaultTimeout, Before, After } = require("cucumber");
const { expect } = require("chai");


setDefaultTimeout(30 * 1000);

When("I do call {string} with data:", async function(req, jsonString) {
    const [method, path] = req.split(":");
    jsonString = this.setVariables(jsonString);
    await this.apiCall(method, path, JSON.parse(jsonString));
});

When("I do call {string} request to {string} for login with body:", async function(method, path, jsonString) {
    jsonString = this.setVariables(jsonString);
    // console.log(jsonString, '------------------------------------------')
    await this.apiCall(method, path, JSON.parse(jsonString));
});

When("I do call {string} request to {string} with body:", async function(method, path, jsonString) {
    jsonString = this.setVariables(jsonString);
    await this.apiCall(method, path, JSON.parse(jsonString));
});

When("I do call {string} request to {string} for launch application with body:", async function(method, path, jsonString) {
    jsonString = this.setVariables(jsonString);
    await this.apiCall(method, path, JSON.parse(jsonString));
});

Then("I receives status code {string}", function(code) {
    expect(this.getLastResponse().status, "to equal", code);
});

Then("The response should contain:", function(jsonString) {
    // console.log('jsonstring', jsonString)
    // console.log('this.getLastResponse()', this.getLastResponse())
    const lastResponse = this.getLastResponse();

    expect(lastResponse.body).to.be.not.null;

    jsonString = this.setVariables(jsonString);
    const json = JSON.parse(jsonString);

    Object.keys(json).forEach(key => {
        console.log('lastResponse', lastResponse)
        expect(lastResponse.body[key]).to.eql(json[key]);
    });
});

Then("The response should be empty", function() {
    expect(this.getLastResponse().body).to.be.null;
});

Then("Header contains key {string}", function(headerKey) {
    expect(this.getLastResponse().headers).to.have.property(headerKey.toLowerCase());
});

Then("Item in {string} table with {string} should not be empty", async function (table, idName) {
    const lastResponse = this.getLastResponse();
    const id = lastResponse["body"][idName];
    const item = await this.getItemFromTableById(table, id);
    expect(item).not.undefined;
});

Then("Item with {string} matches item with {string}", async function (table, idName) {
    const lastResponse = this.getLastResponse();
    const id = lastResponse["body"][idName];
    const item = await this.getItemFromTableById(table, id);
    expect(item).not.undefined;
});

Then("Header contains key {string} and value {string}", function(headerKey, headerValue) {
    const lastResponse = this.getLastResponse();

    const k = headerKey.toLowerCase();
    const v = headerValue.toLowerCase();

    expect(lastResponse.headers).to.have.property(k);
    expect(lastResponse.headers[k].length).to.equal(1);
    expect(lastResponse.headers[k][0]).to.equal(v);
});

Given("I launch application", async function() {
    await this.launchApplication();
    expect(this.user).to.be.not.undefined;
});

Given("I send IAPReceipt", async function() {
    await this.sendIAPReceipt();
    expect(this.user).to.be.not.undefined;
});


Given("I launch application as non operator", async function() {
    await this.launchApplicationWithIPNonOperator();
    expect(this.user).to.be.not.undefined;
});

Given("I launch application as Peru user", async function() {
    await this.launchApplicationAsPeruUser();
    expect(this.user).to.be.not.undefined;
});

Given("I do alternative login for active user", async function() {
    await this.alternativeLogin();
    expect(this.user).to.be.not.undefined;
});


Given("I perform sign up", async function() {
    await this.signup();
    expect(this.user).to.be.not.undefined;
});

Given("I save videos", async function() {
    await this.saveVideos();
});

Given("I save vocabs", async function() {
    await this.saveVocabs();
});




Given("I clean extra tables data", async function() {
    if (this.environment === "prod") return "skipped";
    const lastResponse = this.getLastResponse();

    const deviceID = lastResponse["body"]["deviceID"];
    await this.cleanByID(deviceID, "Device");

    const sessionID = lastResponse["body"]["sessionID"];
    await this.cleanByID(sessionID, "Session");

    const appUserID = lastResponse["body"]["appUserID"];
    await this.cleanByID(appUserID, "Installation");
});

/*
 *******************************  Before *******************************
 */
Before({ tags: "@notAllowedForProd" }, function() {
    if (this.environment === "prod") return "skipped";
});

Before({ tags: "@skipped" }, function() {
    return "skipped";
});

Before({ tags: "@launchApplication" }, async function() {
    await this.launchApplication();
});

/*
 *******************************  After *******************************
 */
After({ tags: "@after-removeDeviceIdFromDynamoDB" }, async function(scenario) {
    if (this.environment === "prod") return "skipped";
    await this.clean();
});

After({ tags: "@after-removeInstallationFromDynamoDB" }, async function(scenario) {
    if (this.environment === "prod") return "skipped";
    const lastResponse = this.getLastResponse();
    const appUserID = lastResponse["body"]["appUserID"];
    await this.cleanByID(appUserID, "Installation");
});

After({ tags: "@after-removeSessionFromDynamoDB" }, async function(scenario) {
    if (this.environment === "prod") return "skipped";
    const lastResponse = this.getLastResponse();
    const sessionID = lastResponse["body"]["sessionID"];
    await this.cleanByID(sessionID, "Session");
});

After({ tags: "@after-removeDeviceFromDynamoDB" }, async function(scenario) {
    if (this.environment === "prod") return "skipped";
    const lastResponse = this.getLastResponse();
    const deviceID = lastResponse["body"]["deviceID"];
    await this.cleanByID(deviceID, "Device");
});

After({ tags: "@after-removeProgressFromDynamoDB" }, async function(scenario) {
    if (this.environment === "prod") return "skipped";
    const sessionID = this.user["sessionID"];
    await this.cleanByID(sessionID, "Progress", "sessionID");
});

