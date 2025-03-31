import express from 'express'
import {verifyRole, verifySessionToken} from '../middlewares/sessionUtils.js'
import { pool } from '../index.js';
import { queries } from '../queries.js';
let router = express.Router();




// 
router.post('/', verifySessionToken, verifyRole, async (req , res) => {
    const { weight,  inventory, shippingFrom, shippingTo} = req.body;
    let userId = req.userId
    console.log(userId, weight, inventory, shippingFrom, shippingTo);
    if (!userId || !weight ||   !inventory || !shippingFrom || !shippingTo){
        return res.status(400).json({name:"incomplete fields"});
    }

    let jsonInventory = JSON.stringify(inventory);

    try{
        let result = await pool.query(queries.shippingForm.addShippingFormQ, [userId, weight, "pending", jsonInventory, shippingFrom, shippingTo]);
        if (result.rowCount > 0){
            console.log("TRIGER1")
            return res.status(200).json({status: "success", message: "succesfully added shipping form", data: result.rows})
        }else{
            console.log("TRIGER2");
            return res.status(200).json({status: "success", message: "cant add shippping form", data: null})
        }
    }catch(e){
        console.log(e)
        return res.status(500).json({status: "error", message: "Cannot get shipping form server error" })
    }


})

router.get('/', verifySessionToken, verifyRole, async (req,res)=> {
    try{
        let result = await pool.query(queries.shippingForm.getShippingFormQ);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully get shipping form", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "no shipping form present", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get shipping form server error" })
    }
})

router.get('/pending', verifySessionToken, verifyRole, async (req,res)=> {
    try{
        let result = await pool.query(queries.shippingForm.getPendingShippingForm, ['pending']);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully get shipping form", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "no shipping form present", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get shipping form server error" })
    }
})

router.get('/shippingFormByUserId', verifySessionToken, verifyRole, async (req,res)=> {

    const userId = req.userId;
    
    try{
        let result = await pool.query(queries.shippingForm.getShippingFormQByUserIdQ, [userId]);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully get shipping form", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "no shipping form present", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get shipping form server error" })
    }
})


router.get('/getShippingFormByVehicleId', verifySessionToken, verifyRole, async(req,res)=> {
    const {vehicleId} = req
    try{
        let result = await pool.query(queries.shippingForm.getShippingFormByVehicleId, [vehicleId]);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully get shipping form", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "no shipping form present", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get shipping form server error" })
    }    
})



router.patch('/updateStatus', verifySessionToken, async (req,res) => {

    const {newStatus, formId} = req.body
    console.log(newStatus, formId)
    try{

        let result = await pool.query(queries.shippingForm.updateShippingFormStatusById, [newStatus, formId])
        if (result.rowCount > 0){

            // this logic is to find another a courier from shipping_to
            if (newStatus = "waiting"){
                let SRF;
                try{
                    SRF = await pool.query(queries.shippingForm.updateShippingFormApproval, [newStatus, shippingFormId]);
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
                // but in this case it would only use the to since its SRF is already from sortation going to the actual location now.

                let SRFCity; // shipping request form but with the city
                try{
                    SRFCity = await pool.query(queries.shippingForm.getShippingFormQIncludingLocationAndCityOfToAndFrom, [statusApproval, shippingFormId])
                }catch(e){
                    console.log(e)
                    return res.status(403).json({status: "failed", message: "could not get shipping to and from city due to server err", data: null})
                }


                let to_city_id = SRFCity.rows[0].to_city_id;


                // logic below is logic for finding a qualified vehicle to be place in SRF
                let qualifiedVehicle;
                try{
                    qualifiedVehicle = await pool.query(queries.vehicle.getAvailableVehicleForSRFQByCapacityAndCity, [to_city_id, SRFWeight])
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
                    let result = await pool.query(queries.shippingForm.updateShippingFormToAVehicleToId, [qualifiedVehicleId, SRFId]);
                    if( result.rowCount > 0){
                        return res.status(403).json({status: "success", message: "sucesfully connected to a vehicle Id", data: null})
                    }
                }catch(e){
                    console.log(e) 
                    return res.status(403).json({status: "success", message: "did not connect to a vehicle id due to server error", data: null})
                }        

            }else{
                res.status(200).json({status: "success", message: "succesfully updatedform", data: result.rows})
            }
            
        }
    }catch(e){
        console.log(e)
        return res.status(500).json({status: "error", message: "Cannot get shipping form server error" })
    }



})


export {router};