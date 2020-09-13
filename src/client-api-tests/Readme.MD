# Client API integration tests

## Install

```shell
npm install
```

## Run from command line

```shell
./node_modules/.bin/cucumber-js
```

## VS code run configuration

```json
{
    "type": "node",
    "request": "launch",
    "name": "Launch Client API tests",
    "console": "integratedTerminal",
    "cwd": "${workspaceFolder}/src/client-api-tests",
    "program": "${workspaceFolder}/src/client-api-tests/node_modules/cucumber/bin/cucumber-js",
    "env": {
        "KANTOO_CLIENT_API_URL": "https://dev.apikantoo.com"
    }
}
```
