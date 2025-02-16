import { Router } from 'express';
import { ShopValidation } from './shops.validation';
import { ShopController } from './shops.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Users/user.constant';

const router = Router();

router.post(
  '/create-shop',
  auth(USER_ROLE.Admin, USER_ROLE.Sp, USER_ROLE.User),
  validateRequest(ShopValidation.createShopValidationSchema),
  ShopController.createShop,
);
router.get(
  '/my-shop',
  auth(USER_ROLE.Admin, USER_ROLE.Sp, USER_ROLE.User),
  ShopController.getShopData,
);
router.get(
  '/request',
  auth(USER_ROLE.Admin),
  ShopController.getShopRequestData,
);
router.get(
  '/rejected',
  auth(USER_ROLE.Admin),
  ShopController.getRejectedShopData,
);
router.get(
  '/my-shop/:id',

  ShopController.getShopDataById,
);

router.put(
  '/my-shop/:id',
  auth(USER_ROLE.Admin, USER_ROLE.Sp, USER_ROLE.User),
  ShopController.updateShopData,
);
router.delete(
  '/my-shop/:id',
  auth(USER_ROLE.Admin, USER_ROLE.Sp, USER_ROLE.User),
  ShopController.deleteShopData,
);
router.patch(
  '/status/:id',
  auth(USER_ROLE.Admin),
  ShopController.toggleShopStatus,
);

router.get('/', ShopController.allShopData);

export const ShopRoutes = router;
