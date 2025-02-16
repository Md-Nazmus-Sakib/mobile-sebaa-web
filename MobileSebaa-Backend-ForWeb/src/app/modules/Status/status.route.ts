import { Router } from 'express';

import { USER_ROLE } from '../Users/user.constant';
import auth from '../../middlewares/auth';
import { StatusController } from './status.controller';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.Admin),

  StatusController.createStatus,
);

export const StatusRoutes = router;
