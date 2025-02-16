/* eslint-disable @typescript-eslint/no-explicit-any */

import Shop from '../Shops/shops.model';
import { User } from '../Users/user.model';
//================================================================================

//================================================================================
const getStatusFromDB = async () => {
  const totalUsers = await User.countDocuments(); // Get total user count
  const totalUsersAdmin = await User.countDocuments({ role: 'Admin' });
  const totalUsersAsUser = await User.countDocuments({ role: 'User' });
  const totalUsersSp = await User.countDocuments({ role: 'Sp' });
  const totalUsersBlocked = await User.countDocuments({ status: 'blocked' });

  const totalShops = await Shop.countDocuments(); // Get total shop count
  const totalPendingShop = await Shop.countDocuments({ status: 'Pending' });
  const totalRejectedShop = await Shop.countDocuments({ status: 'Rejected' });
  const totalDeletedShop = await Shop.countDocuments({ isDeleted: true });

  return {
    totalShops,
    totalUsers,
    totalPendingShop,
    totalRejectedShop,
    totalDeletedShop,
    totalUsersAdmin,
    totalUsersAsUser,
    totalUsersSp,
    totalUsersBlocked,
  };
};
//================================================================================

//================================================================================
export const StatusServices = {
  getStatusFromDB,
};
