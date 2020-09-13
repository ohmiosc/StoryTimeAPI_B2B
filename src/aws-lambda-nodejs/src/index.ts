import { Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import * as serverless from 'aws-serverless-express';
import { Logger } from './lib/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as constants from './constants';

let cachedServer: Server;
const express = require('express')();

function lamarkServer(): Promise<Server> {

  const options = new DocumentBuilder()
    .setTitle(`Lamark ${constants.ENV} API`)
    .setDescription(`${constants.ENV} API`)
    .setSchemes('https')
    .setVersion('1.0')
    .build();

  return NestFactory.create(AppModule, express)
    .then(app => app.enableCors())
    .then(app => {

      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('api', app, document);

      return app;
    })
    .then(app => app.init())
    .then(() => serverless.createServer(express));
}

export const handler: Handler = (
  event: any,
  context: Context,
) => {
  publicIP = JSON.stringify(event.headers['X-Forwarded-For']);
  // Logger.info('Public IP = ', publicIP);
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
