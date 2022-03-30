export interface HttpExceptionResponse {
    statusCode: number;
    error: string;
    message:[]
}
export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
    path: string;
    method: string;
    timeStamp: Date;
}