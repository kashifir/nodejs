/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/


let express = require("express");
/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * pieces.METHOD (PATH, HANDLER)
 *
 * * GET : The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
 * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
 * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI. The data POSTed might be, for example, an annotation for existing resources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
 * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing resource, it is modified; if the URI does not point to an existing resource, then the server can create the resource with that URI.[24]
 * DELETE : The DELETE method deletes the specified resource.
 * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
 * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
 * PATCH : The PATCH method applies partial modifications to a resource.
 *
 * @type { Router }
 */
let pieces = express.Router();

let db = require("../database/db");

/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start pieces router module ****************************************************
 *****************************************************************************************************************/


// get All piece


pieces.get("/All", (req, res) => {
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
});


// get All piece by marque
pieces.get("/byMarque/:id", (req, res) => {
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
            if(pieces !== "") {
                res.json(pieces)
            }else {
                res.json({error: "not pieces with this marque"})
            }
        })
        .catch(err => {
            res.send("error" + err)
        })
});

// get All piece by ref_piece que
pieces.get("/byRef/:ref_piece", (req, res) => {
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
            if(pieces !== "") {
                res.json(pieces)
            }else {
                res.json({error: "not pieces with this ref"})
            }
        })
        .catch(err => {
            res.send("error" + err)
        })
});

// get All piece by type_moteur que
pieces.get("/Bytype_moteur/:type_moteur", (req, res) => {
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
            if(pieces !== "") {
                res.json(pieces)
            }else {
                res.json({error: "not pieces with this ref"})
            }
        })
        .catch(err => {
            res.send("error" + err)
        })
});


// get findId pieces
pieces.get("/FindByName/:name", (req, res) => {
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
});

// delete pieces
pieces.delete("/delete/:id", (req,res) =>{
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
});

//update pieces

pieces.put("/update/:id",(req,res) =>{
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
});

// add new pieces in database
pieces.post("/new", (req,res) =>{
  // create data for add new marque if not existe in database
    const marques =
        {marque: req.body.marque};
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
                        const piecedata = {
                            ref_piece: req.body.ref_piece,
                            name: req.body.name,
                            modele: req.body.modele,
                            type_moteur: req.body.type_moteur,
                            prix: req.body.prix,
                            stock: req.body.stock,
                            marqueId: marque.id
                        };
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
                };
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
});





module.exports = pieces;

/************************************** end pieces  module ****************************************************
 *****************************************************************************************************************/


