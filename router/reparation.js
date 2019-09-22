/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/

let express = require("express");
/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * reparation.METHOD (PATH, HANDLER)
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
let reparation = express.Router();
let db = require("../database/db");

/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start reparation router module ****************************************************
 *****************************************************************************************************************/

// get All Reparation
reparation.get("/All", (req, res) => {
    db.reparation.findAll({
        attributes: {
            include: [],
            exclude: []
        },
    })
        .then(reparations => {
            res.json(reparations)
        })
        .catch(err => {
            res.send("error" + err)
        })
});

// delete pieces
reparation.delete("/delete/:id", (req,res) =>{
    // find the pieces you want you delete
    db.reparation.findOne({
        where:{id: req.params.id}
    }).then(reparations =>{
        // if pieces exist so
        if(reparations) {
            // delete this pieces
            reparations.destroy().then(() => {
                // send back the  confirmation of  pieces is deleted
                res.json("reparations deleted")
            })
            // catch if error
                .catch(err => {
                    // send back the error to info that in json
                    res.json("error" + err)
                })
        }
        else {
            // send back the error message to info that you can't deleted this pieces it not exist in your database
            res.json({error : "you can't delete this reparations it not exist in you list of reparations"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});

//update pieces

reparation.put("/update/:id",(req,res) =>{
    // find the pieces you want to update in you database with the params id
    db.reparation.findOne({
        where:{id: req.params.id}
    })
        .then(reparations =>{
            // update the reparations  whit all data
            reparations.update(
                {
                    date_de_reparations: req.body.date_de_reparations,
                    temps_de_reparations: req.body.temps_de_reparations,
                    prixtotal: req.body.prixtotal
                }
            )
            // then get back the pieces you jeut updated
                .then(() =>{
                    db.reparation.findOne({
                        where:{ id: req.params.id }
                    })
                        .then(reparations =>{
                            // send back to you user app to confirmation that reparations is update
                            res.json(reparations)
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

// add new reparation in database
reparation.post("/new", (req,res) =>{

    // make a variable
    let typerep = "t";
    // try to find some type of reparation if this is esixt
    db.typereparation.findOne({
        where:{type_reparation: req.body.type_reparation}
    })
        .then(typerepartion => {
            typerep = typerepartion.id;
        })
        .catch(err => {
            res.json({error: "error" + err})
        });
    // create data for add new reparation
    const datarepartion = {
        date_de_reparations: req.body.date_de_reparations,
        temps_de_reparations: req.body.temps_de_reparations,
        prixtotal: req.body.prixtotal,
        voitureId: req.body.voitureId,
        employeId: req.body.employeId,
        typereparationId: typerep
    };
    db.reparation.create(datarepartion)
        .then(repartion =>{
            res.json(repartion)
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
});

module.exports = reparation;


/************************************** End Router Require module ****************************************************
 *****************************************************************************************************************/

