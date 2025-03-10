import express from 'express';
import { pool } from '../index.js';
import {queries} from '../queries.js'
import argon from 'argon2';
import { verifySessionToken, verifyRole } from '../middlewares/sessionUtils.js';
const router = express.Router()


router.post('/login', async (req,res)=> {

    const {username, password} = req.body

    try {
        let result = await pool.query(queries.users.getUserByUsernameQ, [username]);
        if (result.rowCount > 0) {
            const user = result.rows[0];
            let match = await argon.verify(user.password, password)
            if (match){
                req.session.userSessionObject = {userId: user.id, companyId: user.company_id};
                res.status(200).json({status: "success", message: "succesfully login", data: {firstName: user.first_name, companyName: user.company_name}})
            }else{
                res.status(401).json({status: "fail", message: "invalid password"});
            }
        }else{
            res.status(401).json({status: "fail", message: "user not found"});
        }
        
    }catch(e){
        console.log(e)
        res.status(500).json({status: "failed", message: "could not process login"});
    }

})


router.post('/register', async (req,res)=> {
    const {username, password, firstName, lastName, email, phoneNumber, companyId, companyName, locationsObj} = req.body;


    if (!username || !password || !firstName || !lastName || !email || !phoneNumber || !companyId) {
        console.log(e)
        return res.status(400).json({ status: "fail", message: "Incomplete credentials" });
    }
    let newCompanyId = null;


    // if its 1 or 2 dont create
    if (companyId !== 1 && companyId !== 2){
        try {
            let result = await pool.query(queries.company.createCompany, [companyName]);
            if (result.rowCount === 0){
                return res.status(400).json({ status: "fail", message: "not created company" });
            }
            newCompanyId = result.rows[0].id;
        }catch(e){
            console.log(e)
            return res.status(500).json({ status: "fail", message: "not created company" });
        }
    }



    // if its 1 or 2 dontcreate location ithink not sure
    if (companyId !== 1 && companyId !== 2){
        try{
            for (let location of locationsObj ){
                await pool.query(queries.location.createLocation, [newCompanyId, location.name, location.address, location.status])
            }
        }catch(e){
            console.log(e)
            return res.status(500).json({ status: "fail", message: "not created location" });
        }
    }


    // basically if newCompany was not created then its the defauklt one which is admin or courier
    if (newCompanyId === null){
        newCompanyId = companyId;
    }

    let userId;
    try {
        // Hash password
        const hashedPassword = await argon.hash(password);
        // Insert user and retrieve their ID
        const userResult = await pool.query(queries.users.registerQ, [username, hashedPassword, firstName, lastName, email, phoneNumber, true, newCompanyId]);
        if (userResult.rowCount === 0) {
            return res.status(400).json({ status: "fail", message: "User cannot be created" });
        }
        userId = userResult.rows[0].id

        if (companyId !== 2){
            return res.status(200).json({ status: "success", message: "User created successfully" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Cannot create user" });
    }


    // vech
    let vehicleId;

    if (companyId === 2){
        try{
            let result = await pool.query(queries.vehicle.getUnassignedVehicleQ);
            if (result.rowCount === 0){
                return res.status(500).json({ status: "fail", message: "not assigned vechile" });
            }
            vehicleId = result.rows[0].id
            try{
                let result2 =await pool.query(queries.vehicle.updateVehicleQ, [userId, vehicleId])
                if (result2.rowCount === 0){
                    return res.status(400).json({ status: "fail", message: "vechile has not been assigned" });
                }
                res.status(200).json({status:"success", message: "vehicle has been assigned"})
            }catch(e){
                console.log(e)
                return res.status(500).json({ status: "fail", message: "not assigned vechile" });
            }


        }catch(e){
            console.log(e);
            return res.status(500).json({ status: "fail", message: "not assigned vechile" });
        }
    }


})


router.get('/', async (req,res)=> {
    try{
        let result = await pool.query(queries.users.getUsersQ);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully get user", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "cant get user", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get Users" })
    }
})


router.post('/checkSessionToken', verifySessionToken, verifyRole, async (req,res) => {

    let userId = req.userId;
    let companyId = req.companyId;

    if (!userId || !companyId){
        res.status(402).json({status:"error", message:"cannot get session credentials"});
    }

    let companyName;
    if (companyId === 1){
        companyName = "AnyLogisticsA"
    }

    if (companyId === 2){
        companyName = "AnyLogisticsB"
    }

    if (companyId > 2){
        companyName = "clients"
    }

    console.log("COMPNY NAME + ", companyName)

    res.status(200).json({status:"success", message:"succesfully gotten session credentials", data:{companyName:companyName}})
});




export {router};



