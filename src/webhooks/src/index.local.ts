import { Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import * as serverless from 'aws-serverless-express';

// let cachedServer: Server;
// const express = require('express')();

// function lamarkServer(): Promise<Server> {
//     return NestFactory.create(AppModule, express)
//         .then(app => app.enableCors())
//         .then(app => app.init())
//         .then(() => serverless.createServer(express));
// }

async function bootstrap() {
    const localApp = await NestFactory.create(AppModule);
    await localApp.listen(3000);
}

bootstrap();

