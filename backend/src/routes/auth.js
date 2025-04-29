import express from 'express';
import authCtrl from '../controllers/AuthCtrl.js';

const router = express.Router();

router.post('/login', authCtrl.login);

export default router;