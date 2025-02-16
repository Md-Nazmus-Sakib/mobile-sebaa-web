import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TShop } from './shops.interface';
import Shop from './shops.model';
import { User } from '../Users/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { shopSearchableFields } from './shops.constant';

const createShopIntoDB = async (email: string, shopData: TShop) => {
  // Find the user by email
  const user = await User.findOne({ email });

  // If the user doesn't exist, throw an error
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with the email ${email} does not exist.`,
    );
  }

  // Set the 'createdBy' field to the user's ID
  shopData.createdBy = user._id;

  // Check if a shop with the given mobile number already exists
  const existingShop = await Shop.findOne({ mobile: shopData.mobile });

  if (!existingShop) {
    // Create a new shop if no shop with the same mobile exists
    const newShop = await Shop.create(shopData);
    return newShop;
  }

  // If the existing shop is not approved, throw a forbidden error
  if (existingShop.status !== 'Approve') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `The shop status is ${existingShop.status}.`,
    );
  }

  // If the existing shop is marked as deleted, reactivate it and update its data
  if (existingShop.isDeleted) {
    const updatedShop = await Shop.findOneAndUpdate(
      { mobile: existingShop.mobile },
      { $set: { ...shopData, isDeleted: false } },
      { new: true, runValidators: true },
    );
    return updatedShop;
  }

  // If the shop exists and is neither blocked nor deleted, throw a conflict error
  throw new AppError(
    httpStatus.CONFLICT,
    `A shop with the mobile number ${shopData.mobile} already exists.`,
  );
};

//================================================================================
const getShopDataFromDB = async (userEmail: string) => {
  // Find the user by email
  const createShopUser = await User.findOne({ email: userEmail }).lean();

  if (!createShopUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with email ${userEmail} not found.`,
    );
  }

  // Find the shop using the user's ObjectId
  const result = await Shop.findOne({ createdBy: createShopUser._id }).lean();

  // If no shop found or it's deleted, return a proper error
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, `Shop not found.`);
  }

  return result;
};
//================================================================================
//================================================================================
const getShopRequestDataFromDB = async () => {
  // Find users with status 'Pending'
  const pendingShops = await Shop.find({ status: 'Pending' }).lean();

  // Get the count of pending shops
  const pendingShopsCount = pendingShops.length;

  // Return both the pending shops data and the count
  return {
    pendingShops,
    pendingShopsCount,
  };
};

//================================================================================
//================================================================================
const getRejectedShopDataFromDB = async () => {
  // Find users with status 'Pending'
  const rejectShops = await Shop.find({ status: 'Rejected' }).lean();

  // Get the count of reject shops
  const rejectShopsCount = rejectShops.length;

  // Return both the reject shops data and the count
  return {
    rejectShops,
    rejectShopsCount,
  };
};

//================================================================================
//================================================================================
const getShopDataFromDbById = async (id: string) => {
  // Ensure you query using _id if it's an ObjectId
  const shopDataById = await Shop.findOne({ _id: id }).lean();

  if (!shopDataById) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Shop with the given ID not found.`,
    );
  }

  return shopDataById;
};

//================================================================================

//================================================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateShopDataIntoDB = async (id: string, payload: any) => {
  // Check if the payload contains the role field

  if ('status' in payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Status cannot be changed');
  }
  // Find the shop by ID
  const existingShop = await Shop.findOne({ _id: id });

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, `Shop with ID ${id} not found.`);
  }
  const result = await Shop.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};
//================================================================================

//================================================================================
const deleteShopDataIntoDB = async (id: string) => {
  // Find the shop by ID
  const existingShop = await Shop.findOne({ _id: id });

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, `Shop with ID ${id} not found.`);
  }

  if (existingShop.isDeleted) {
    throw new AppError(httpStatus.GONE, `Shop with ID ${id} has been deleted.`);
  }
  // Set the 'isDeleted' field to true
  const payload = { isDeleted: true };

  const result = await Shop.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};
//================================================================================

//================================================================================
const toggleShopStatusIntoDB = async (id: string, status: string) => {
  // Find the shop by ID
  const existShop = await Shop.findOne({ _id: id });

  // If the shop doesn't exist, throw an error
  if (!existShop) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This Shop With The ID ${id} does not exist.`,
    );
  }

  // Get the associated user using the email from the shop
  const existUser = await User.findOne({ email: existShop.userEmail });

  if (!existUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `No user found with the email ${existShop.userEmail}.`,
    );
  }

  // If the user role is "user", update it to "Sp"
  if (existUser.role === 'User') {
    await User.findOneAndUpdate(
      { email: existShop.userEmail },
      { $set: { role: 'Sp' } },
      { new: true, runValidators: true },
    );
  }

  // Update shop status
  const payload = { status };
  const result = await Shop.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};

//================================================================================

//================================================================================
const getAllShopDataFromDB = async (query: Record<string, unknown>) => {
  // Create an instance of QueryBuilder to build the query
  const shopQuery = new QueryBuilder(
    Shop.find({ isDeleted: { $ne: true }, status: 'Approve' }), // Added status filter
    query,
  )
    .search(shopSearchableFields)
    .filter();

  // Perform the count query before pagination
  const totalShop = await shopQuery.modelQuery.clone().countDocuments();

  // Apply sorting and pagination
  shopQuery.sort().paginate();

  // Execute the final query with sorting and pagination
  const result = await shopQuery.modelQuery.exec(); // Use exec() to execute query

  // Return the shop data along with the total count
  return { shop: result, totalShop };
};

//================================================================================

export const ShopServices = {
  createShopIntoDB,
  getShopDataFromDB,
  updateShopDataIntoDB,
  deleteShopDataIntoDB,
  toggleShopStatusIntoDB,
  getAllShopDataFromDB,
  getShopDataFromDbById,
  getShopRequestDataFromDB,
  getRejectedShopDataFromDB,
};
