const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const app = express();
const isValidUser = require('./router/auth_users.js').isValid;
const secretKey = require('./constants.js').secretKey;
app.use(express.json());
app.use("/customer",session({secret:secretKey,resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session.authorization) {
        let token = req.session.authorization;
        jwt.verify(token, secretKey,(err,user)=>{
            if(!err && isValidUser(user)){
                req.user = user;
                next();
            }
        });
    } 
    return res.status(403).json({message: 'User is not authenticated'});
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));