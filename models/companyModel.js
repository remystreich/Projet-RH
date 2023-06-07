const mongoose = require('mongoose');
const employeeModel = require('./employeeModel')

const companyShema = new mongoose.Schema({
    name: {
        type: String,
        unique: true, 
        validate: {
            validator: function(v){
                return /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,}$/.test(v);
            }
        }
    },
    siret: {
        type: Number,
        unique: true, 
        validate: {
            validator: function(v){
                return /^\d{14}$/.test(v);
            }
        }
    },
    ceoName: {
        type: String,
        validate: {
            validator: function(v){
                return /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,}$/.test(v);
            }
        }
    },
    mail :{
        type : String,
        validate: {
            validator: function(v){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            }
        }
    },
    password : {
        type : String,
        validate: {
            validator: function(v){
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v);
            }
        }
    },
    employees: [ employeeModel.schema],
})

const companyModel = mongoose.model("companys", companyShema);
module.exports= companyModel