import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

import * as fs from 'fs';

import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from './models/http-exception-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); //get the response
    const request = ctx.getRequest<Request>();    //get the request

    let status: HttpStatus; //get the http status code
    let httpErrorMessage: string; //http error message
    let message: []; //error message from validations

    if (exception instanceof HttpException) {
      status = exception.getStatus(); //get http status 
      const httpErrorResponse = exception.getResponse();
      httpErrorMessage =
        (httpErrorResponse as HttpExceptionResponse).error || exception.message;
      message =
        (httpErrorResponse as HttpExceptionResponse).message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR; //internal server error error code
      httpErrorMessage = 'Critical internal server error occurred!';
      message['error']
    }

    const errorResponse = this.getErrorResponse(status, httpErrorMessage, request, message);
    const errorLog = this.getErrorLog(errorResponse, request, exception);
    this.writeErrorLogToFile(errorLog);
    response.status(status).json(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    httpErrorMessage: string,
    request: Request,
    message: []
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: httpErrorMessage,
    message: message,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
  });

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
    request: Request,
    exception: unknown,
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;
    const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
      ${JSON.stringify(errorResponse)}\n\n
      User: ${JSON.stringify(request.user ?? 'Not signed in')}\n\n
      ${exception instanceof HttpException ? exception.stack : error}\n\n`;
    return errorLog;
  };

  private writeErrorLogToFile = (errorLog: string): void => {
    fs.open('error.log', 'r', (error, file) => {
      if (error) {
        fs.writeFile('error.log', errorLog, (err) => {
          if (err) console.error(err);
          console.log('Data written');
        });
      } else {
        fs.appendFile('error.log', errorLog, 'utf8', (err) => {
          if (err) throw err;
        });
      }
    })

  };
}