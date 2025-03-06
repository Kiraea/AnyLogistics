import express from 'express';
import { pool } from '../index.js';
import {queries} from '../queries.js'
import argon from 'argon2';
import { verifySessionToken, verifyRole } from '../middlewares/sessionUtils.js';
const router = express.Router()


router.post('/login', async (req,res)=> {
    const {username, password} = req.body
    console.log("HAPPENS");
    try {
        let result = await pool.query(queries.users.getUserByUsernameQ, [username]);
        if (result.rowCount > 0) {
            const user = result.rows[0];
            let match = await argon.verify(user.password, password)
            if (match){
                req.session.userSessionObject = {userId: user.id, roleId: user.role_id};
                res.status(200).json({status: "success", message: "succesfully login", data: {firstName: user.first_name, roleName: user.role_name}})
            }else{
                res.status(401).json({status: "fail", message: "invalid password"});
            }
        }else{
            res.status(401).json({status: "success", message: "user not found"});
        }
        
    }catch(e){
        console.log(e)
        res.status(500).json({status: "failed", message: "could not process login"});
    }

})


router.post('/register', async (req,res)=> {
    const { username, password, firstName, lastName, email, phoneNumber, roleId } = req.body;


    if (!username || !password || !firstName || !lastName || !email || !phoneNumber || !roleId) {
        return res.status(400).json({ status: "fail", message: "Incomplete credentials" });
    }

    let roleData = {}; // Store additional role-specific fields
    if (roleId === 1) {
        const { companyName, companyAddress } = req.body;
        if (!companyName || !companyAddress) {
            return res.status(400).json({ status: "fail", message: "Incomplete credentials for client" });
        }
        roleData = { companyName, companyAddress };
    }
    else if (roleId === 2){
        // code for couriers
    }else if (roleId === 3){
        // code for admins
    }

    try {
        // Hash password
        const hashedPassword = await argon.hash(password);

        // Insert user and retrieve their ID
        const userResult = await pool.query(
            `INSERT INTO users (username, password, first_name, last_name, email, phone_number, role_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [username, hashedPassword, firstName, lastName, email, phoneNumber, roleId]
        );

        if (userResult.rowCount === 0) {
            return res.status(400).json({ status: "fail", message: "User cannot be created" });
        }

        const userId = userResult.rows[0].id; 


        let roleInsertQuery;
        let roleValues = [userId];

        if (roleId === 1) { // Clients
            roleInsertQuery = `INSERT INTO clients (user_id, company_name, address) VALUES ($1, $2, $3)`;
            roleValues.push( roleData.companyName, roleData.companyAddress);
        } else if (roleId === 2) { // Couriers
            roleInsertQuery = `INSERT INTO couriers (user_id) VALUES ($1)`;
        } else if (roleId === 3) { // Admins
            roleInsertQuery = `INSERT INTO admins (user_id) VALUES ($1)`;
        }

        if (roleInsertQuery) {
            await pool.query(roleInsertQuery, roleValues);
        }

        res.status(201).json({ status: "success", message: "User created successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Cannot create user" });
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
    let roleId = req.roleId;

    if (!userId || !roleId){
        res.status(402).json({status:"error", message:"cannot get session credentials"});
    }

    let roleName;
    if (roleId === 1){
        roleName = "clients"
    }

    if (roleId === 2){
        roleName = "couriers"
    }

    if (roleId === 3){
        roleName = "admins"
    }

    res.status(200).json({status:"success", message:"succesfully gotten session credentials", data:{roleName: roleName}})
});




export {router};



