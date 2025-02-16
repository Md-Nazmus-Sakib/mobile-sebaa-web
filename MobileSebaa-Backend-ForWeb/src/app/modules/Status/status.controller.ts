import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponce';
import { StatusServices } from './status.service';

//========================================================================

const createStatus = catchAsync(async (req, res) => {
  const result = await StatusServices.getStatusFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status are retrieved successfully',
    data: result,
  });
});
//========================================================================

//========================================================================
export const StatusController = {
  createStatus,
};
