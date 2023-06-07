const dashboardRouter = require('express').Router();
const companyModel = require('../models/companyModel');
const employeeModel = require('../models/employeeModel')
const authguard = require("../services/authguard")
const upload = require('../services/multer')
const fs = require('fs');


///page dashboard
dashboardRouter.get('/dashboard',  authguard, async (req, res) => {
    try {
        let company = req.session.user
        let employees = company.employees
        res.render('templates/dashboard.twig', {
            employees: employees,
        })
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

///page addemployee
dashboardRouter.get('/addemployee',  authguard, async (req, res) => {
    try {
        res.render('templates/addemployee.twig')
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

//ajouter employé
dashboardRouter.post('/addemployee', authguard, upload.single('photo'), async (req, res) => {  //enregistrement d'une image avec multer avec upload.single(une seule image) et entre paranthese le name de l'input 
    try {
        let employee = new employeeModel(req.body)   //nouvel objet "project" constitué du form de la requete
        if (req.file){                              //si il y'a une image dans la requete
            employee.photo = req.file.filename;      //ajout du nom de l'image à l'objet project
        }
        else{
            employee.photo = ""                      //sinon nom vide
        }
        let company = req.session.user
        company.employees.push(employee)
        
        await company.save()                        //enregistrement en bdd du project
        res.redirect('/dashboard')
    }
    catch (error) {
        console.log(error)
        res.send(error)
    }
})

//supprimer un projet
dashboardRouter.get('/deleteEmployee/:index', authguard, async (req, res) => {
    try {
        let company = req.session.user
        let index = parseInt(req.params.index)-1
        let employee = company.employees[[index]]
        // Vérifier si l'employé a une image associée
        if (employee.photo) {
            // Supprimer le fichier d'image
            fs.unlink(`views/assets/img/uploads/${employee.photo}`, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression du fichier :', err);
                    // Gérer l'erreur de suppression du fichier
                } else {
                    console.log('Fichier supprimé avec succès');
                }
            });
        }
        company.employees.pull(employee)
        await company.updateOne(company)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

//blamer employé
dashboardRouter.get('/blame/:index', authguard , async (req, res) => {
    try {
        let company = req.session.user
        let index = parseInt(req.params.index)-1
        company.employees[[index]].blames++
        if (company.employees[[index]].blames >= 3) {
            let employee = company.employees[[index]]
        // Vérifier si l'employé a une image associée
        if (employee.photo) {
            // Supprimer le fichier d'image
            fs.unlink(`views/assets/img/uploads/${employee.photo}`, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression du fichier :', err);
                    // Gérer l'erreur de suppression du fichier
                } else {
                    console.log('Fichier supprimé avec succès');
                }
            });
        }
        company.employees.pull(employee)
        }
    
        await company.updateOne(company)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

//afficher un employé avant de le modifier
dashboardRouter.get('/updateEmployee/:index', authguard, async (req, res) => {
    try {
        let company = req.session.user
        let index = parseInt(req.params.index)-1
        let employee = company.employees[[index]]
        res.render("templates/addEmployee.twig", {
            employee: employee,
            index:index                       //récupérer le projet par rapport à l'id envoyé en requete                  //surbrillance de l'onglet
        })
    }
    catch (error) {
        console.log(error)
        res.send(error)
    }
})

//modifier l'employé'
dashboardRouter.post('/updateEmployee/:index', authguard, upload.single('photo'), async (req, res) => {
    try {
        let company = req.session.user
        let index = parseInt(req.params.index)
        let employee = company.employees[[index]]      //creation de l'objet project à partir de l'elem trouvé en bdd par rapport à son id
        console.log(employee);
        let update = req.body                                                     // creation de l'objet update avec les elm du form de la requete
        if (req.file){                                                            // si une image est en requete
            if (employee.photo) {                                                  //si une image est déja en bdd
                fs.unlink(`views/assets/img/uploads/${employee.photo}`);           // Supprimer le fichier d'image
            }
            update.photo = req.file.filename                                      //ajout du nom de l'image à l'objet update
        }else{
            update.photo= employee.photo
        }
        company.employees[[index]] = update
        await company.save()
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

module.exports = dashboardRouter