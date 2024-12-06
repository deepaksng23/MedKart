const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async(req, res, next) => {
    try{
        // fetch the token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        
        // Check if the token is present or not
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        // Verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode
        } catch(error){
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            })
        }
        next();
    } 
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}