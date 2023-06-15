const userRouter = require('express').Router();
const companyModel = require('../models/companyModel');
const bcrypt = require('bcrypt');
const authguard = require("../services/authguard")


///page accueil
userRouter.get('/', async (req, res) => {
    try {
        res.render('templates/lobby.twig')
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

//afficher signin
userRouter.get('/signin', async (req, res) => {
    try {
        res.render('templates/signin.twig')
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

//signin
userRouter.post('/signin', async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT) );
        let user = new companyModel(req.body);
        await user.save();
        res.redirect('/login')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})


//afficher login
userRouter.get('/login', async (req, res) => {
    try {
        res.render('templates/login.twig')
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})


//login
userRouter.post('/login', async (req, res) => {
    try {
        let user = await companyModel.findOne({ mail: req.body.mail})
        if (user){
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.userId = user._id
                console.log('taratata');
                res.redirect('/dashboard')
            }
            else {
                throw { errorPass: "le mot de passe est incorect"}
            }
    
        }else{
          throw { errorMail: "invalide mail"}
        }
    }
    catch (error) {
        console.log(error)
        res.render('templates/login.twig',{
            error: error
        })
    }
})

//logout 
userRouter.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

//afficher un profil entreprise avant de le modifier
userRouter.get('/updateCompany/:id', authguard, async (req, res) => {
    try {
        let user = await companyModel.findOne({ _id: req.params.id })
        res.render("templates/signin.twig", {
            user: user,                      
        })
    }
    catch (error) {
        console.log(error)
        res.send(error)
    }
})

//modifier le profil
userRouter.post('/updateCompany/:id', authguard, async (req, res) => {
    try {
        let company = await companyModel.findOne({ _id: req.params.id })       
        let update = req.body     
        if (req.body.password) {
            update.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT) );
        }
        else{
            update.password = company.password
        }                                               
        await company.updateOne(update)                                           
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

module.exports = userRouter