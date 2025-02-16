/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const { statusCode, success, message, token, data: responseData } = data;

  const responseObj: any = {
    success,
    statusCode,
    message,
    data: responseData,
  };

  if (token) {
    responseObj.token = token;
  }

  res.status(statusCode).json(responseObj);
};

export default sendResponse;
