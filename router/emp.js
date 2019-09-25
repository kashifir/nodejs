/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
const express = require('express');

/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * route.METHOD (PATH, HANDLER)
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
const emp = express.Router();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../database/db');
/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start route module ****************************************************
 *****************************************************************************************************************/

process.env.SECRET_KEY = "secret";


// register
emp.post("/register", (req, res) => {
    const userdata = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: req.body.password,
        competences: req.body.competences,
        poste: req.body.poste,
        garageId: req.body.garageId,
        atelierId: req.body.atelierId,
    };
    // find if user existe  or not
    // select * from tbl_user where email = 'toto@toto.fr'
    db.emp.findOne({
        where: {email: req.body.email}
    })
        .then(user => {
            if (!user) {
                // make hash of password in bcrypt, salt 10
                const hash = bcrypt.hashSync(userdata.password, 10);
                userdata.password = hash;
                db.emp.create(userdata)
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        res.json({token: token})
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "user already exists"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});
// login
emp.post("/login", (req, res) => {
    db.emp.findOne({
        where: {email: req.body.email}
    })
        .then(user => {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                });
                res.json({token: token})
            } else {
                res.send('error mail or error password')
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});


// update
emp.post("/update", (req, res) => {
    db.emp.findOne({
        where: {email: req.body.email}
    })
        .then(user => {
           if(user){
               // make hash of password in bcrypt, salt 10
               const hash = bcrypt.hashSync(req.body.password, 10);
               user.update({
                   nom: req.body.nom,
                   prenom: req.body.prenom,
                   email: req.body.email,
                   password: hash,
                   competences: req.body.competences,
                   poste: req.body.poste,
               })
           }
           else {
               res.json({
                   error: "can't update this employe his is not your epmloye"
               })
           }
        })
        .catch(err => {
            res.send('error' + err)
        })
});

// update
emp.post("/update/:id", (req, res) => {
    db.emp.findOne({
        where: {email: req.params.id}
    })
        .then(user => {
            if(user){
                // make hash of password in bcrypt, salt 10
                const hash = bcrypt.hashSync(req.body.password, 10);
                user.update({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    password: hash,
                    competences: req.body.competences,
                    poste: req.body.poste,
                })
            }
            else {
                res.json({
                    error: "can't update this employe his is not your epmloye"
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});



// delete emp
emp.delete("/delete/:id", (req,res) =>{
    // find the employe you want you delete
    db.emp.findOne({
        where:{id: req.params.id}
    }).then(emp =>{
        // if pieces exist so
        if(emp) {
            // delete this pieces
            emp.destroy().then(() => {
                // send back the  confirmation of  employe is deleted
                res.json("emp deleted")
            })
            // catch if error
                .catch(err => {
                    // send back the error to info that in json
                    res.json("error" + err)
                })
        }
        else {
            // send back the error message to info that you can't deleted this emp it not exist in your database
            res.json({error : "you can't delete this employe it not exist in you list of employes"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});


// delete emp
emp.delete("/deleteBy/:email", (req,res) =>{
    // find the employe you want you delete
    db.emp.findOne({
        where:{id: req.params.email}
    }).then(emp =>{
        // if pieces exist so
        if(emp) {
            // delete this pieces
            emp.destroy().then(() => {
                // send back the  confirmation of  employe is deleted
                res.json("emp deleted")
            })
            // catch if error
                .catch(err => {
                    // send back the error to info that in json
                    res.json("error" + err)
                })
        }
        else {
            // send back the error message to info that you can't deleted this emp it not exist in your database
            res.json({error : "you can't delete this employe it not exist in you list of employes"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});

// find by email emp
emp.get("/Find/:email", (req,res) =>{
    // find the employe by email
    db.emp.findOne({
        where:{id: req.params.email}
    }).then(emp =>{
        // if pieces exist so
        if(emp) {
            res.json({
                employe: emp
            })
        }
        else {
            // send back this emp it not exist in your database
            res.json({error : "This employe  exist in you list of employes"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});


// findAll  emp
emp.get("/All", (req,res) =>{
    // find the employe by email
    db.emp.findAll().
    then(emps =>{
        res.json(emps)
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});



module.exports = emp;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/
