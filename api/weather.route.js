import express from 'express';
import UserInfoCtrl from './user_info.controller.js';
import LoginCtrl from './login.controller.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/user')
    .get(protect, UserInfoCtrl.apiGetUserLocation)// get user location
    .put(protect, UserInfoCtrl.apiAddLocation) // add location to user 
    .delete(protect, UserInfoCtrl.apideleteLocation) //delete location

router.post('/register',LoginCtrl.apiRegister)
router.post('/logout',LoginCtrl.apiLogout)
router.post('/login', LoginCtrl.apiLogin)
export default router;
