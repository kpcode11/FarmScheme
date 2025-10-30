import { Router } from 'express';
import { synthesize } from '../controllers/tts.controller.js';

const router = Router();

router.post('/synthesize', synthesize);

export default router;


