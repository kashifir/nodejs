let express = require("express");
let voitures = express.Router();

let db = require("../database/db");



// get All voitures
voitures.get("/All", (req, res) => {
    db.voiture.findAll({
        include: [{
            model: db.client,

        },{
            model: db.marque,
        }],
        attributes: {
            include: [],
            exclude: ["marqueId"]
        },
    })
        .then(voitures => {
            res.send(voitures)
        })
        .catch(err => {
            res.send("error" + err)
        })
});

// get voitures by numero_plaque
voitures.get("/FindBy/:numero_plaque", (req, res) => {
    //find all voiture with is plaque
    db.voiture.findAll({
        // get client
        include: [{
            model: db.client,
        },{
            // get marque
            model: db.marque,
        }],
        attributes: {
            include: [],
            exclude: ["marqueId"]
        },
        // where numero_plaque = numero_plaque
        where: {numero_plaque: req.params.numero_plaque}

    })
        // then get voitures
        .then( voitures=> {
            // if voitures != null or ''
            if(voitures != "") {
                // send back respone in json
                res.json(voitures)
            }
            else {
                res.json({
                    error: "not voiture with this plaque"
                })
            }
        })
        .catch(err => {
            res.send("error" + err)
        })
});



// add new voitures

voitures.post("/new", (req, res) =>{

    var marquedata = {marque:req.body.marque};
    //ntry to find client
    db.client.findOne({
        where:{id: req.body.id}
    })
        .then(client => {
            // if client exist then
            if(client){
                // we try to find marque
                db.marque.findOne({
                    where:{marque: req.body.marque}
                })
                    .then(marque =>{
                        // if marque exist then
                        if(marque){
                            var cardata = {
                                marqueId: marque.id,
                                modele: req.body.modele,
                                type_moteur: req.body.type_moteur,
                                numero_plaque: req.body.numero_plaque,
                                annee: req.body.annee,
                                couleur: req.body.couleur,
                                clientId: client.id
                            }
                            // we try to find if voiture allready in database
                            db.voiture.findOne({
                                where: {numero_plaque:req.body.numero_plaque}
                            }).then(car => {
                                // if not exist os then
                                if(!car){
                                    // we create new one in database
                                    db.voiture.create(cardata)
                                        .then(rescar =>{
                                            // then we sand back
                                        res.json(rescar);
                                    })
                                        .catch(err => {
                                            // if error catch and then send back
                                            res.json('error' + err)
                                        })
                                }
                                // send back message to informe that voiture is allready in database
                                else{
                                    res.json('voiture allready in database');
                                }
                            })
                                // catch if error and send back
                                .catch(err => {
                                    res.json('error' + err)
                                })
                        }
                        else{
                            // if marque not in data base so user have to add before add voiture to datalist
                            res.json('add marque before to add your voiture ')
                        }
                    })
                    // catch if error
                    .catch(err => {
                        // send back if error
                        res.json("error" + err);
                    })
            }
        })
});







module.exports = voitures;


