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



router.get('/', verifySessionToken, verifyRole, async (req,res)=> {

    const roleId = req.companyId;
    
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

export {router};