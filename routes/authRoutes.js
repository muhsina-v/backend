import express from 'express'
import tryCatch from '../utils/tryCatch.js'
import { loginUser, logout,userRegister } from '../controllers/authController.js'

const router = express.Router()

router
.post("/register",tryCatch(userRegister))
.post("/login",tryCatch(loginUser))
.post("/logout",tryCatch(logout)) 

export default router;