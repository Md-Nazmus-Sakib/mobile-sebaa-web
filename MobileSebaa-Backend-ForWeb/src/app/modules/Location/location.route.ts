import { Router } from 'express';
import { LocationController } from './location.controller';

const router = Router();

router.get('/', LocationController.allLocationData);

export const LocationRoutes = router;
