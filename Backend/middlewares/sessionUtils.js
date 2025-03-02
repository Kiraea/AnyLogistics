

const verifySessionToken = (req, res, next) => {
    const userSessionObject =  req.session?.userSessionObject;
    if (userSessionObject !== null && userSessionObject.userId != null){
        req.userId = userSessionObject;

        console.log(req.userId);
        next()
    }else{
        res.status(401).json({error: "Unauthorized user"})
    }
}


const verifyRole = (request, response, next) => {
    const {userId} = req;

    // get userId, search database query, then get role then pu trole in req then next() pero no database yet
    
}

export {verifySessionToken}