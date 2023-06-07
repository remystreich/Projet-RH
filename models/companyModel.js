const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const employeeModel = require('./employeeModel')

const companyShema = new mongoose.Schema({
    name: {
        type: String,
        validate: {
            validator: function(v){
                return /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,}$/.test(v);
            }
        }
    },
    siret: {
        type: Number,
       
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
    //employees: [ employeeModel.schema],
    employees:  [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'employees' 
        },
        
    ]
})

const companyModel = mongoose.model("companys", companyShema);
module.exports= companyModel