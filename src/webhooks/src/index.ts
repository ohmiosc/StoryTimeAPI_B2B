import { Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import * as serverless from 'aws-serverless-express';

let cachedServer: Server;
const express = require('express')();

function lamarkServer(): Promise<Server> {
  return NestFactory.create(AppModule, express)
    .then(app => app.enableCors())
    .then(app => app.init())
    .then(() => serverless.createServer(express));
}

export const handler: Handler = (event: any, context: Context, callback: any) => {
  publicIP = JSON.stringify(event.headers['X-Forwarded-For']);
  console.log('Public IP = ', publicIP);
  if (!cachedServer) {
    lamarkServer().then(server => {
      cachedServer = server;
      return serverless.proxy(server, event, context);
    });
  } else {
    return serverless.proxy(cachedServer, event, context);
  }
};

export let publicIP: string;
