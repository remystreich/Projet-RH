const userRouter = require('express').Router();
const companyModel = require('../models/companyModel');
const bcrypt = require('bcrypt');



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
        console.log(req.body.mail);
        if (user){
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.userId = user._id
                res.redirect('/dashboard')
            }
            else {
                res.redirect('/login')
            }
    
        }else{
            res.status(400)
            res.send("identifiants incorrects")
        }
    }
    catch (error) {
        console.log(error)
        res.send(error)
        console.log(req.body);
    }
})

//logout 
userRouter.get('/logout', async (req, res) => {
    req.session.destroy()
})

module.exports = userRouter