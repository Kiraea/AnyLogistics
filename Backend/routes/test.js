import express from 'express'
import {verifyRole, verifySessionToken} from '../middlewares/sessionUtils.js'

let router = express.Router();

router.get('/test', verifySessionToken, verifyRole, (req , res) => {
    console.log("accessed")
    console.log(req.userId);
    console.log(req.roleId);
})

export {router};