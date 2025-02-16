import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';

import sendResponse from '../../utils/sendResponce';
import httpStatus from 'http-status';
import { LocationService } from './location.service';

const allLocationData = catchAsync(async (req: Request, res: Response) => {
  const result = await LocationService.getAllLocation();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Countries retrieved successfully',
    data: result,
  });
});

export const LocationController = {
  allLocationData,
};
