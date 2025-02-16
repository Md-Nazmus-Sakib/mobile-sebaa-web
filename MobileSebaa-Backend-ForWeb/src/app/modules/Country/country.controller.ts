import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';

import { CountryService } from './country.service';
import sendResponse from '../../utils/sendResponce';
import httpStatus from 'http-status';

const getOneCountry = catchAsync(async (req: Request, res: Response) => {
  const searchQuery = req.query.search as string;
  const result = await CountryService.getOneCountry(searchQuery);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Countries retrieved successfully',
    data: result,
  });
});

export const CountryController = {
  getOneCountry,
};
