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
            if (match && user.is_validated === true){
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
                await pool.query(queries.location.createLocation, [newCompanyId, location.name, location.address, location.cityId])
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
        const hashedPassword = await argon.hash(password);
            let userResult;
        if (companyId === 1){
            userResult = await pool.query(queries.users.registerQ, [username, hashedPassword, firstName, lastName, email, phoneNumber, true, newCompanyId]);
        }
        if (companyId === 2){

            userResult = await pool.query(queries.users.registerQ, [username, hashedPassword, firstName, lastName, email, phoneNumber, true, newCompanyId]);
        }
        if (companyId === 3){
            userResult = await pool.query(queries.users.registerQ, [username, hashedPassword, firstName, lastName, email, phoneNumber, true, newCompanyId]);
        }

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
        return res.status(402).json({status:"error", message:"cannot get session credentials"});
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

    return res.status(200).json({status:"success", message:"succesfully gotten session credentials", data:{companyName:companyName}})
});


router.get('/unverifiedUsers', async (req,res)=> {
    try{
        let result = await pool.query(queries.users.getUnverifiedUsersQ);
        if (result.rowCount > 0){
            console.log("trigger1")
            console.log(result.rows);
            res.status(200).json({status: "success", message: "succesfully get unverified user", data: result.rows})
        }else{
            console.log("trigger2")
            res.status(200).json({status: "success", message: "cant get unverified user", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get unverified Users" })
    }
})

router.patch(`/updateValidation`, async (req,res)=> {
    const {userId, validationStatus} = req.body
    try{
        let result = await pool.query(queries.users.updateVerificationUserQ, [validationStatus, userId]);
        if (result.rowCount > 0){
            console.log("triggerv11")
            res.status(200).json({status: "success", message: "succesfully updated unverified user", data: result.rows})
        }else{
            console.log("triggerv11")
            res.status(200).json({status: "fail", message: "cant update unverified user", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot update unverified User" })
    }
})


router.get(`/getPublicInformationOfUser`, verifySessionToken, async (req,res)=> {
    const {userId} = req
    console.log(userId);
    try{
        let result = await pool.query(queries.users.getPublicInformationOfUserQ, [userId]);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully gotten public information of user", data: result.rows})
        }else{
            res.status(200).json({status: "fail", message: "cant get user public", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get user public info due to server errors" })
    }    
})

router.patch('/updateEmailAndPhone', verifySessionToken, async (req,res) => {
    const {userId} = req
    const {email, phoneNumber} = req.body

    console.log(userId, email, phoneNumber);
    console.log(userId);
    try{
        let result = await pool.query(queries.users.updateEmailAndPhoneNumberQ, [email,phoneNumber, userId]);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "succesfully gotten public information of user", data: result.rows})
        }else{
            res.status(200).json({status: "fail", message: "cant get user public", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot get user public info due to server errors" })
    }    
})


export {router};



