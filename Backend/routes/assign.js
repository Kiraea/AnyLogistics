import express from 'express'
import { queries } from '../queries.js';

import { pool } from '../index.js';
let router = express.Router()

// lets say accepted
router.post(`/updateStatusAndAssignToQualifiedDriver`, async (req, res)=> {

    const {statusApproval, shippingFormId} = req.body
    let SRF;
    try{
        SRF = await pool.query(queries.shippingForm.updateShippingFormApproval, [statusApproval, shippingFormId]);

    }catch(e){
        console.log(e) 
        return res.status(403).json({status: "success", message: "did not update due to server error", data: null})
    }

    // checks if updating status did not work meaning it idd not return any data
    if (SRF.rowCount <= 0){
        return res.status(403).json({status: "failed", message: "did not update status since it did not return", data: null})
    }

    // if declined just return it was declined no need for further logic
    if (SRF.rows[0].status === "declined"){
        return res.status(403).json({status: "failed", message: "admin declined succesfully", data: null})
    }

    let SRFWeight = SRF.rows[0].weight; // wait of the SRF cause we would need it for like finding trucks logic capacity thingy
    let SRFId = SRF.rows[0].id; // wait of the SRF cause we would need it for like finding trucks logic capacity thingy


    // logic below is for getting the city of  the "from" and "to"  of  a shipping form
    // but in this case it would only use the from since assining palang meaning driver would only deliver until sotration center

    let SRFCity; // shipping request form but with the city
    try{
        SRFCity = await pool.query(queries.shippingForm.getShippingFormQIncludingLocationAndCityOfToAndFrom, [statusApproval, shippingFormId])
    }catch(e){
        console.log(e)
        return res.status(403).json({status: "failed", message: "could not get shipping to and from city due to server err", data: null})
    }


    let from_city_id = SRFCity.rows[0].from_city_id;


    // logic below is logic for finding a qualified vehicle to be place in SRF
    let qualifiedVehicle;
    try{
        qualifiedVehicle = await pool.query(queries.vehicle.getAvailableVehicleForSRFQByCapacityAndCity, [from_city_id, SRFWeight])
    }catch(e){
        console.log(e)
        return res.status(403).json({status: "failed", message: "error in finding free vehicles server error", data: null})
    }

    if (qualifiedVehicle.rowCount <= 0){
        return res.status(403).json({status: "failed", message: "no free vehicles are available", data: null})
    }


    let qualifiedVehicleId = qualifiedVehicle.rows[0].id
    // set SRF to have FK of the qualifiedVehicle

    try{
        let result = await pool.query(queries.shippingForm.updateShippingFormToAVehicleId, [qualifiedVehicle, SRFId]);
        if( result.rowCount > 0){
            return res.status(403).json({status: "success", message: "sucesfully connected to a vehicle Id", data: null})
        }
    }catch(e){
        console.log(e) 
        return res.status(403).json({status: "success", message: "did not connect to a vehicle id due to server error", data: null})
    }        
}) 




export {router};