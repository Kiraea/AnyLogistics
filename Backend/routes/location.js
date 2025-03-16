import express from 'express'
import { queries } from '../queries.js';

import { pool } from '../index.js';
let router = express.Router()

router.get(`/`, async (req, res)=> {
    try{
        let result = await pool.query(queries.location.getLocationsQ);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully get location", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "no location found", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get locations" })
    }    
})









export {router}