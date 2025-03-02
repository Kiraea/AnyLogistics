import express from 'express'
import {verifySessionToken} from '../middlewares/sessionUtils.js'

let router = express.Router();

router.get('/test', verifySessionToken, (req , res)=> {
    console.log("accessed")
    console.log(req.userId);
})

export {router};