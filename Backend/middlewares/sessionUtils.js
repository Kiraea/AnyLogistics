import { pool } from "../index.js";
import { queries } from "../queries.js";

const verifySessionToken = (req, res, next) => {
    const userSessionObject = req.session?.userSessionObject;
    if (userSessionObject !== null && userSessionObject.userId != null){
        req.userId = userSessionObject.userId;

        console.log(req.userId);
        next()
    }else{
        return res.status(401).json({error: "Unauthorized user"})
    }
}


const verifyRole = async (req, res, next) => {
    const {userId} = req;

    try{
        let result = await pool.query(queries.users.getUserByIdQ, [userId]);

        if (result.rowCount === 0){
            res.status(401).json({error: "No Role found, Unauthorized"});
        }
        req.companyId = result.rows[0].company_id;
        next();
    }catch(e){
        console.log(e)
        return res.status(401).json({error: "Unauthorized user"})
    }
    // get userId, search database query, then get role then pu trole in req then next() pero no database yet
}
export {verifySessionToken, verifyRole}