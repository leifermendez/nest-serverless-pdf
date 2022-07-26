import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
/**
 * Dos servicio uno para localhost, prod
 */
import { LambdaService } from './lambda/lambda.service';
import { NotLambdaService } from './not-lambda/not-lambda.service';

/**
 * AWS  Lambda provee los argumentos
 * @param event 
 * @param context 
 * @param callback 
 * @returns 
 */
export const handler: Handler = async (event: any,context: Context,callback: Callback) => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const appService = appContext.get(LambdaService); //TODO esto esta para localhost
  const user = {
    name: `${event.queryStringParameters?.name}`,
  }
  return {
    body: await appService.buildPdf(user),//TODO es buffer base64
    headers: {
      'Content-type': 'application/pdf',
    },
    isBase64Encoded: true,
    statusCode: HttpStatus.OK,
  };
};
