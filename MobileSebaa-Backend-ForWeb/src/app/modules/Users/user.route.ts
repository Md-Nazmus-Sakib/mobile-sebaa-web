import { Router } from 'express';
import { UserController } from './user.controller';
import { USER_ROLE } from './user.constant';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router.get(
  '/me',
  auth(USER_ROLE.Admin, USER_ROLE.User, USER_ROLE.Sp),
  UserController.getUserData,
);

router.put(
  '/me',
  auth(USER_ROLE.Admin, USER_ROLE.User, USER_ROLE.Sp),
  UserController.updateUserData,
);
router.delete(
  '/me',
  auth(USER_ROLE.Admin, USER_ROLE.User, USER_ROLE.Sp),
  UserController.deleteUserData,
);

router.patch('/status', auth(USER_ROLE.Admin), UserController.toggleUserStatus);
router.patch('/role', auth(USER_ROLE.Admin), UserController.updateUserRole);
router.get('/', auth(USER_ROLE.Admin), UserController.allUserData);

router.put(
  '/upload-image',

  auth(USER_ROLE.Admin, USER_ROLE.User, USER_ROLE.Sp),
  upload.single('file'),
  UserController.ImageUploads,
);

export const UserRoutes = router;
