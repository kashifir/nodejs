let express = require("express");
let router = express.Router();


let db = require("../database/db");



// get All Reparation
router.get("/All", (req, res) => {
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
router.delete("/delete/:id", (req,res) =>{
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

router.put("/update/:id",(req,res) =>{
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
router.post("/new", (req,res) =>{

    // make a variable
    var typerep = "t";
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
    var datarepartion = {
        date_de_reparations:req.body.date_de_reparations,
        temps_de_reparations:req.body.temps_de_reparations,
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





module.exports = router;


