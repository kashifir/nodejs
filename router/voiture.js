/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/

let express = require("express");
/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * voitures.METHOD (PATH, HANDLER)
 * GET : The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
 * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
 * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI. The data POSTed might be, for example, an annotation for existing resources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
 * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing resource, it is modified; if the URI does not point to an existing resource, then the server can create the resource with that URI.[24]
 * DELETE : The DELETE method deletes the specified resource.
 * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
 * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
 * PATCH : The PATCH method applies partial modifications to a resource.
 * @type { Router }
 */
let voitures = express.Router();

let db = require("../database/db");


/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start voitures module ****************************************************
 *****************************************************************************************************************/



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
            if(voitures !== "") {
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

    const marquedata = {marque: req.body.marque};
    //try to find client
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
                            const cardata = {
                                marqueId: marque.id,
                                modele: req.body.modele,
                                type_moteur: req.body.type_moteur,
                                numero_plaque: req.body.numero_plaque,
                                annee: req.body.annee,
                                couleur: req.body.couleur,
                                clientId: client.id
                            };
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

/************************************** end router voitures module ****************************************************
 *****************************************************************************************************************/


