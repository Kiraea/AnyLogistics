import express from 'express'
import { queries } from '../queries.js';

import { pool } from '../index.js';
let router = express.Router()


router.get(`/`, async (req, res)=> {
    try{
        let result = await pool.query(queries.city.getCitiesQ);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully get cities", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "no cities found", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get cities" })
    }    
}) 


router.get(`/post`, async (req, res)=> {
    const {city} = req.body
    try{
        let result = await pool.query(queries.city.addCitiesQ, [city]);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully add cities", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "cannot add cities", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot add cities due to server error, please try again" })
    }    
}) 





export {router};
