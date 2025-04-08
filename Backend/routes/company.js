import express from 'express'
import { queries } from '../queries.js';

import { pool } from '../index.js';
                
import { verifyRole, verifySessionToken } from '../middlewares/sessionUtils.js';

let router = express.Router()

router.get(`/`, async (req, res)=> {
    try{
        let result = await pool.query(queries.company.getCompany);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully get companies", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "no companies found but success", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "error getting companies" })
    }    
})


export {router}