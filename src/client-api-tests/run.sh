#!/usr/bin/env bash

rm -rf node_modules/
npm i

chmod u+x ./node_modules/.bin/cucumber-js 

mkdir ./out

# TODO add tags to CLI call ->  long, running, production, development
./node_modules/.bin/cucumber-js --format=reporter.js