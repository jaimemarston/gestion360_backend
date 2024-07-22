
import { Router } from 'express';
import { authenticateUser } from '../controllers/google.controller.js';
import { checkGoogleBody } from '../middleware/google/check-body.middleware.js';


const router = Router();

router.post('/', checkGoogleBody, authenticateUser);

export default router;
