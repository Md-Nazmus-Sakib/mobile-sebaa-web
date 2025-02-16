import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponce';
import { ShopServices } from './shops.service';

//Create User Controller
const createShop = catchAsync(async (req, res) => {
  const shopData = req.body;
  const userEmail = req.user.userEmail;
  const result = await ShopServices.createShopIntoDB(userEmail, shopData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Shop registered successfully Please Wait For Admin Approved',
    data: result,
  });
});

//========================================================================

const getShopData = catchAsync(async (req, res) => {
  const userEmail = req.user.userEmail;
  const result = await ShopServices.getShopDataFromDB(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop Information retrieved successfully',
    data: result,
  });
});
//========================================================================
//========================================================================

const getShopRequestData = catchAsync(async (req, res) => {
  const result = await ShopServices.getShopRequestDataFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop Information retrieved successfully',
    data: result,
  });
});
//========================================================================

const getRejectedShopData = catchAsync(async (req, res) => {
  const result = await ShopServices.getRejectedShopDataFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop Information retrieved successfully',
    data: result,
  });
});
//========================================================================
//========================================================================

const getShopDataById = catchAsync(async (req, res) => {
  const { id } = req.params; // Extract id from req.params
  const result = await ShopServices.getShopDataFromDbById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop Information retrieved successfully',
    data: result,
  });
});
//========================================================================

//========================================================================
const updateShopData = catchAsync(async (req, res) => {
  const updateData = req.body;
  const { id } = req.params;

  const result = await ShopServices.updateShopDataIntoDB(id, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop info updated successfully',
    data: result,
  });
});
//========================================================================

//========================================================================
const deleteShopData = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ShopServices.deleteShopDataIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop Deleted successfully',
    data: result,
  });
});
//========================================================================

//========================================================================
const toggleShopStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const result = await ShopServices.toggleShopStatusIntoDB(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Shop status successfully updated to ${status}.`,
    data: result,
  });
});
//========================================================================

//========================================================================
const allShopData = catchAsync(async (req, res) => {
  const result = await ShopServices.getAllShopDataFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop are retrieved successfully',
    data: result,
  });
});
//========================================================================

export const ShopController = {
  createShop,
  getShopData,
  updateShopData,
  deleteShopData,
  toggleShopStatus,
  allShopData,
  getShopDataById,
  getShopRequestData,
  getRejectedShopData,
};
