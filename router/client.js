// require all module you need to use for you page
// create express
var express = require("express");
// create router
var router = express.Router();
//create db
var db = require("../database/db")



// get All clients with out voiture
router.get("/All", (req, res) => {
    // Find all clients with out there voiture
    db.client.findAll({
        // if you neec you use
        attributes: {
            include: [],
            exclude: []
        },
    })
        // get list of clients All clients in your database
        .then(clients => {
            // send back respose in json liste of clients
            res.json(clients)
        })
        // catch error if something happend
        .catch(err => {
            // send back error
            res.send("error" + err)
        })
});

//get All clients and them voitures

router.get("/getAll",(req,res)=>{
    // Find All client with there voitures
    db.client.findAll({
        all:true,
        attributes: {
            include: [],
            // don't need to show this filed
            exclude: ["updated_at", "created_at"]
        },
        include: [{
            // get voiture of clients
            model: db.voiture,
            include: [{
                model: db.marque,
            }],
            attributes: {
                include: [],
                // don't need to show this filed
                exclude: ["clientId", "updated_at", "created_at"]
            },
        }],
    })
        // get clients
        .then(clients =>{
            // send back clients
            res.json(clients);
        })
        // if error catch if and send back for user app to show him if some error
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
})

// add new client and voiture
router.post("/new", (req,res) =>{
// create data marque if need to add new data in table marque
    var marque =
        {marque:req.body.marque};
    // create data client if need to add new data in table client
    var clientdata = {
        nom: req.body.nom,
        prenom : req.body.prenom,
        email: req.body.email,
        tel: req.body.tel
    }
    // try to find client exist in base
    db.client.findOne({
        where:{ email: req.body.email}
    }).then(client =>{
        // if client is not in base so
        if(!client){
            // we create new client add data "clientdata"
            db.client.create(clientdata)
                // send back data client
                .then(data =>{
                    // now we try to find if marque in base
                    db.marque.findOne({
                        // where marque = marque
                        where:{marque: req.body.marque}
                    })
                        // then send marque when get back
                        .then(smarque => {
                       // if marque is not in base so do this
                        if(!smarque) {
                            // we create new marque add data "marque"
                            db.marque.create(marque)
                                // thene send back marque
                                .then(smarque => {
                                   // after then we create data car for add in database
                                    var cardata = {
                                        marqueId: smarque.id,
                                        modele: req.body.model,
                                        type_moteur: req.body.type_moteur,
                                        numero_plaque: req.body.numero_plaque,
                                        annee: req.body.annee,
                                        couleur: req.body.couleur,
                                        clientId: data.id
                                    }
                                    // now we try to find if this voiture is in database allreaday or not
                                    db.voiture.findOne({
                                        // with this numero plaque
                                        where: {numero_plaque: req.body.numero_plaque}
                                    })
                                        // then we get voiture
                                        .then(voiture => {
                                            // if not voiture in data base  so add new one
                                            if (!voiture){
                                                // create new recrode in table voiture
                                                db.voiture.create(cardata)
                                                    // then get back new voitures add in datebase
                                                    .then(voiture => {
                                                        // then get back client with voiture
                                                        db.client.findOne({
                                                            // if need to use the attributes
                                                            attributes: {
                                                                // the col we need to get back
                                                                include: [],
                                                                // the col we don't need to get back
                                                                exclude: []
                                                            },
                                                            // this include we add the modele with how we want to make join
                                                            // like : select * form tbl_user Left join  tbl_voiture on tbl_user.id =  tbl_voiture.id
                                                            include: [{
                                                                model: db.voiture,
                                                                through: {
                                                                    attributes: ["marqueId"]
                                                                },
                                                                attributes: {
                                                                    include: [],
                                                                    // mask clientId
                                                                    exclude: ["clientId"]
                                                                },

                                                            }],
                                                            // where id = data.id // then : where id client = id client new client we add in database s
                                                            where: {id: data.id}
                                                        })
                                                            // then sent back client in json
                                                            .then(client => {
                                                                // that will in json {
                                                                // client: {
                                                                // nom: "",
                                                                // prenom: "",
                                                                // etc ...,
                                                                // tbl_voiture: {etc ....}}
                                                                res.json({client: client});
                                                            })
                                                            // if error  then catch and send the error msg back to site or postman
                                                            .catch(err => {
                                                                res.json({
                                                                    error: "error" + err
                                                                })
                                                            })
                                                    })
                                            }
                                            // show message
                                            else{
                                                // the error message will bi send in json
                                                 res.json({
                                                     message: "this voiture is allready in your list you can't add ..."
                                                 })
                                            }
                                        })

                                })
                                // if crror catch then and send back to site or postman
                                .catch(err => {
                                    res.json({
                                        error: "error" + err
                                    })
                                })
                        }else{
                            // then we create data car for add in database
                            var cardata = {
                                marqueId: smarque.id,
                                modele: req.body.model,
                                type_moteur: req.body.type_moteur,
                                numero_plaque: req.body.numero_plaque,
                                annee: req.body.annee,
                                couleur: req.body.couleur,
                                clientId: data.id
                            }
                            // now we try to find is voiture is in database
                            db.voiture.findOne({
                                where: {numero_plaque: req.body.numero_plaque}
                            })

                                .then(voiture => {
                                    // if not voiture with this numero plaque so we create new voiture
                                    if (!voiture){
                                        // create new voiture
                                        db.voiture.create(cardata)
                                            .then(voiture => {
                                                // find client with voiture
                                                db.client.findOne({
                                                    attributes: {
                                                        include: [],
                                                        exclude: []
                                                    },
                                                    include: [{
                                                        // get voiture with client
                                                        model: db.voiture,
                                                        attributes: {
                                                            include: [],
                                                            // don't get cliendId in response
                                                            exclude: ["clientId"]
                                                        },
                                                    }],
                                                    // where id  = id
                                                    where: {id: data.id}
                                                })
                                                    // then get client with voiture
                                                    .then(client => {
                                                        // send back response in json client
                                                        res.json({client: client});
                                                    })
                                                    // catch if error
                                                    .catch(err => {
                                                        // send back response in json  error
                                                        res.json({
                                                            // message = " error = 'error  + err'"
                                                            error: "error" + err
                                                        })
                                                    })
                                            })
                                    }
                                    // else send response message
                                    else{
                                        res.json({
                                            // send back messgae error to show user app this voiture is allreaday in your liste
                                            message: "this voiture is allready in your list you can't add ..."
                                        })
                                    }
                                })
                        }
                        // catch error send back error and show error
                    }).catch(err => {
                        // sebd back response in json
                        res.json({
                            // error : error + err
                            error: "error" + err
                        })
                    })
                })
                // catch error send back error
                .catch(err =>{
                    // send back response in json
                    res.json({error : "can't add client in your database" + err})
            })
        }
        // esle  : if client allready in yous liste
        else {
            // send back respose in json error : client allready in your liste
            res.json({error : "client allready in your liste"})
        }
    })
});


// update client in params his id
//  exmple : localhost:{your port}/{you préfix}/{name_router}/{id }
router.put("/update/:id", (req,res) =>{
    // find one client
    db.client.findOne( {
        where: {id: req.params.id}
    })
        // if this clients allready in your database then update
        .then(() => {
            // make update client with body and id parmas
        db.client.update(
            {
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                tel: req.body.tel },
            {
                where :{id: req.params.id},
                returning: true,
                plain: true
            })
            //
            .then(() =>  {
                // then find this you upadate to get back new data of your clients whit
                db.client.findOne({
                    where: {id: req.params.id}
                })
                    .then(client => {
                        res.send(client);
                    })
                    .catch(err => {
                        res.json({
                            error: "error" + err
                        })
                    })
            })
            .catch(err => {
                res.json("error" + err)
            })
    })
        .catch(err => {
            res.json({
                error: "can't update client" + err
            })
        })
})

// delete  one client
router.delete("/delete/:id", (req,res) =>{
    //find one client where id = is
    db.client.findOne({
        where:{id: req.params.id}
    })
        // then get var client
        .then((client) => {
            // if not client
            if (!client) {
                // send back error message error
                // respose in json send back error : this client not existe in your liste so you can't delete
                res.json({
                    error: "this client not existe in your base"
                })
            } else {
                // if client existe so delete it where id = params.id
                client.destroy()
                    // send back message in json to confime that your client is deleeted !
                    .then(() => {
                        res.json({status: "client deleted"})
                    })
                    // if error catch it and  send back in json to show the user of app you can't delete client you have some probleme
                    .catch(err => {
                        res.json({
                            error: "error" + err
                        })
                    })
            }
        })
        // if error catch it and  send back in json to show the user of app you can't delete client you have some probleme
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
})



module.exports = router;


