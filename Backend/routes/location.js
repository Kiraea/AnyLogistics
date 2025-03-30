import express from 'express'
import { queries } from '../queries.js';

import { pool } from '../index.js';
import { verifyRole, verifySessionToken } from '../middlewares/sessionUtils.js';
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



router.get(`/locationsById`, verifySessionToken, verifyRole, async (req, res)=> {
    let roleId = req.companyId
    try{
        let result = await pool.query(queries.location.getLocationsByCompanyIdQ, [roleId]);
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



router.post(`/`, verifySessionToken, verifyRole, async (req, res)=> {

    let {name, address, cityId} = req.body;
    let roleId = req.companyId

    console.log(roleId);
    try{
        let result = await pool.query(queries.location.createLocation, [roleId, name, address, cityId]);
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