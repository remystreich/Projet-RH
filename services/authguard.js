const companyModel = require('../models/companyModel')

let authguard = async(req,res,next) =>{
        let user = await companyModel.findById(req.session.userId)
        if(user){
            req.session.owner = true
            res.locals.user = user;
            req.session.user = user
            console.log('ca marche');

            next()
        }else{
            req.session.owner = false
            console.log('ca marche pas');
            res.redirect('/login')
        }
   
}

module.exports = authguard