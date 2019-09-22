let express = require("express");
let router = express.Router();

let db = require("../database/db");


// get All piece
router.get("/All", (req, res) => {
    db.piece.findAll({
        include: [{
            model: db.marque,
        }],
        attributes: {
            include: [],
            exclude: []
        },

    })
        .then(pieces => {
            res.json(pieces)
        })
        .catch(err => {
            res.send("error" + err)
        })
})


// get All piece by marque
router.get("/byMarque/:id", (req, res) => {
    db.piece.findAll({
    where:{marqueId: req.params.id},
        include: [{
            model: db.marque,
        }],
        attributes: {
            include: [],
            exclude: []
        },
    })
        .then(pieces => {
            if(pieces != "") {
                res.json(pieces)
            }else {
                res.json({error: "not pieces with this marque"})
            }
        })
        .catch(err => {
            res.send("error" + err)
        })
})

// get All piece by ref_piece que
router.get("/byRef/:ref_piece", (req, res) => {
    db.piece.findAll({
        where:{ref_piece: req.params.ref_piece},
        include: [{
            model: db.marque,
        }],
        attributes: {
            include: [],
            exclude: []
        },
    })
        .then(pieces => {
            if(pieces != "") {
                res.json(pieces)
            }else {
                res.json({error: "not pieces with this ref"})
            }
        })
        .catch(err => {
            res.send("error" + err)
        })
})

// get All piece by type_moteur que
router.get("/Bytype_moteur/:type_moteur", (req, res) => {
    db.piece.findAll({
        where:{type_moteur: req.params.type_moteur},
        include: [{
            model: db.marque,
        }],
        attributes: {
            include: [],
            exclude: []
        },
    })
        .then(pieces => {
            if(pieces != "") {
                res.json(pieces)
            }else {
                res.json({error: "not pieces with this ref"})
            }
        })
        .catch(err => {
            res.send("error" + err)
        })
})


// get findId pieces
router.get("/FindByName/:name", (req, res) => {
    // where you find by name params
    db.piece.find({
        attributes: {
            include: [],
            exclude: []
        },
        where:{name: req.params.name}
    })
        .then(pieces => {
            // send back list of pieces in json
            res.json(pieces)
        })
        .catch(err => {
            // send back error if something happand
            res.send("error" + err)
        })
})

// delete pieces
router.delete("/delete/:id", (req,res) =>{
    // find the pieces you want you delete
    db.piece.findOne({
        where:{id: req.params.id}
    }).then(pieces =>{
        // if pieces exist so
        if(pieces) {
            // delete this pieces
            pieces.destroy().then(() => {
                // send back the  confirmation of  pieces is deleted
                res.json("pieces deleted")
            })
                // catch if error
                .catch(err => {
                    // send back the error to info that in json
                    res.json("error" + err)
                })
        }
        else {
            // send back the error message to info that you can't deleted this pieces it not exist in your database
            res.json({error : "you can't delete this pieces it not exist in you list of pieces"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
})

//update pieces

router.put("/update/:id",(req,res) =>{
    // find the pieces you want to update in you database with the params id
    db.piece.findOne({
        where:{id: req.params.id}
    })
        .then(pieces =>{
            // update the pieces  whit all data
            pieces.update(
                {
                    name:req.body.name,
                    modele:req.body.modele,
                    type_moteur: req.body.type_moteur,
                    prix: req.body.prix,
                    stock: req.body.stock},
               )
                // then get back the pieces you jeut updated
                .then(() =>{
                    db.piece.findOne({
                        where:{ id: req.params.id }
                    })
                        .then(pieces =>{
                            // send back to you user app to confirmation that pieces is update
                            res.json(pieces)
                        })
                        .catch(err => {
                            // if error then send back this message to your user app
                            res.json({error: "error" + err})
                        })
                })
                .catch(err => {
                    res.json({
                        // if error then send back this message to your user app
                        error: "error" + err
                    })
                })
        })
})

// add new pieces in database
router.post("/new", (req,res) =>{
  // create data for add new marque if not existe in database
    var marques =
        {marque:req.body.marque};
    // try to find marque
    db.marque.findOne({
        where: {marque: req.body.marque}
    })
        .then(marque =>{
            // if not exist in database so we creat new one
            if(!marque){
                db.marque.create(marques)
                    .then(marque =>{
                        // then we make data for pieces to add if not exist in data list
                        var piecedata = {
                            ref_piece: req.body.ref_piece,
                            name: req.body.name,
                            modele: req.body.modele,
                            type_moteur: req.body.type_moteur,
                            prix: req.body.prix,
                            stock: req.body.stock,
                            marqueId:  marque.id
                        }
                        // try to find is exist aur not
                        db.piece.findOne({
                            where:{ref_piece: req.body.ref_piece}
                        })
                            .then(pieces =>{
                                if (!pieces){
                                    db.piece.create(piecedata)
                                        .then(pieces => {
                                            res.json(pieces)
                                        })
                                        .catch(err =>{
                                            res.json({
                                                error: "error" + err
                                            })
                                        })
                                }
                                else {
                                    res.json({
                                        error: "that pieces is allready in your database, if you need you can update"
                                    })
                                }
                            })
                            .catch(err =>{
                                res.json({
                                    error: "error" + err
                                })
                            })
                    })
                    .catch(err => {
                        res.json({
                            error: "error" + err
                        })
                    })
            }
            // they is marque esist in data liste
            else {
                var piecedata = {
                    ref_piece: req.body.ref_piece,
                    name: req.body.name,
                    modele: req.body.modele,
                    type_moteur: req.body.type_moteur,
                    prix: req.body.prix,
                    stock: req.body.stock,
                    marqueId:  marque.id
                }
                // find one pieces is exist and add new one
                db.piece.findOne({
                    where:{ref_piece: req.body.ref_piece}
                })
                    .then(pieces =>{
                        if (!pieces){
                            db.piece.create(piecedata)
                                .then(pieces => {
                                    res.json(pieces)
                                })
                                .catch(err =>{
                                    res.json({
                                        error: "error" + err
                                    })
                                })
                        }
                        else {
                            res.json({
                                error: "that pieces is allready in your database, if you need you can update"
                            })
                        }
                    })
                    .catch(err =>{
                        res.json({
                            error: "error" + err
                        })
                    })
            }
        })
        .catch(err => {
            res.json({
                error: "error : " + err
            })
        })
})





module.exports = router;


