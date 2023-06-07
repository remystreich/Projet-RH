const companyModel = require('../models/companyModel')
const session = require('express-session');

let authguard = async(req,res,next) =>{
        let user = await companyModel.findById(req.session.userId)
        if(user){
            req.session.owner = true
            res.locals.user = user;
            req.session.user = user
            next()
        }else{
            req.session.owner = false
            res.redirect('/login')
        }
   
}

module.exports = authguard