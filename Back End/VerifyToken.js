const {Secret_Key}=require('../env')
//middle ware to verify person if it is authorized or not to join route
const VerifyToken = (req,res,next)=>{
const authorizationHeaders=req.headers["authorization"] || req.headers["Authorization"];
if(!authorizationHeaders){  res.status(200).json({
      error: "token is required" 
    })
    next("token is required" );}
const token=authorizationHeaders.split(' ')[1]

//verify token is valid from jwt package:
try {  jwt.verify(token,Secret_Key)

     }
catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(200).json({error:'Token expired'});
        } else {
            res.status(200).json({error:'Invalid token'});
        }
        next(error)
    }
    

            }
module.exports=VerifyToken