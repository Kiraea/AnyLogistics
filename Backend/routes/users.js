import express from 'express';
import { pool } from '../index.js';
import {queries} from '../queries.js'
import argon from 'argon2';
const router = express.Router()


router.post('/login', async (req,res)=> {
    const {username, password} = req.body

    try {
        let result = await pool.query(queries.users.getUserByUsernameQ, [username]);
        if (result.rowCount > 0) {
            const user = result.rows[0];
            let match = await argon.verify(user.password, password)
            if (match){
                req.session.userSessionObject = {userId: user.id};
                res.status(200).json({status: "success", message: "succesfully login", data: {username: user.username, firstName: user.last_name}})
            }else{
                res.status(401).json({status: "fail", message: "invalid password"});
            }
        }else{
            res.status(404).json({status: "success", message: "user not found"});
        }
        
    }catch(e){
        console.log(e)
        res.status(500).json({status: "failed", message: "could not process login"});
    }

})


router.post('/register', async (req,res)=> {

    const {username, password, firstName, lastName, email, phoneNumber} = req.body;

    if (!username || !password || !firstName || !lastName || !email || !phoneNumber){
        res.status(400).json({status: "fail", message: "incomplete credentials"});
    }
    try {

        const hashedPassword = await argon.hash(password)

        let result = await pool.query(queries.users.registerQ, [username, hashedPassword, firstName, lastName, email, phoneNumber]);
        if (result.rowCount > 0){
            res.status(200).json({status: "success", message: "user created", data: result.rows})
        }else{
            res.status(200).json({status: "success", message: "user cant be created", data: null})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status: "error", message: "Cannot create User" })
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




export {router};



