
const express = require('express');
const garage = express.Router();


const db = require('../database/db');

// find all  garage
garage.get("/FindAll", (req,res) =>{
    // find the employe by email
    db.garage.findAll({
    }).then(garage =>{
        // if garage  exist so
        if(garage) {
            res.json({
                garage: garage
            })
        }
        else {
            // send back this emp it not exist in your database
            res.json({error : "you don't have list of garages"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});

module.exports = garage;
