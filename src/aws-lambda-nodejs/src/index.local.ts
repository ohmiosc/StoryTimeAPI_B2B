import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

function lamarkLocalServer() {
  NestFactory.create(AppModule)
    .then(app => app.useGlobalPipes(new ValidationPipe()))
    .then(app => app.listen(3000));
}

lamarkLocalServer();