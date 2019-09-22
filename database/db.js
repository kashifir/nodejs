const Sequelize = require('sequelize');

const db ={}

// conn to database

const dbinfo = new Sequelize("garager","root","root",{
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    operatorsAliases: true,
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle: 10000,
    }

});
dbinfo
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });



//models/tables
db.emp = require('../models/Employe')(dbinfo,Sequelize);
db.garage = require('../models/Garage')(dbinfo,Sequelize);

db.voiture = require('../models/Voiture')(dbinfo,Sequelize);
db.client = require('../models/Client')(dbinfo,Sequelize);

db.piece = require('../models/Pieces')(dbinfo,Sequelize);
db.fornissuer = require('../models/Fournissuer')(dbinfo,Sequelize);

db.reparation = require('../models/Reparation')(dbinfo,Sequelize);

db.paiement = require('../models/Paiement')(dbinfo, Sequelize);
db.atelier = require('../models/Atelier')(dbinfo, Sequelize);
db.marque = require("../models/Marque")(dbinfo, Sequelize);

db.reparation_has_pieces = require('../models/reparation_has_piece')(dbinfo, Sequelize);
db.fournisser_has_piece = require('../models/fournisser_has_piece')(dbinfo, Sequelize);
db.typereparation = require('../models/TypeReparation')(dbinfo, Sequelize);




//Relation
db.garage.hasMany(db.atelier,{foreignKey: "garageId"});
db.atelier.hasOne(db.emp,{foreignKey: "atelierId"});

db.client.hasMany(db.voiture,{foreignKey: "clientId"});
db.voiture.belongsTo(db.client,{foreignKey: "clientId"});

db.voiture.hasMany(db.reparation, {foreignKey: "voitureId" });
db.reparation.belongsTo(db.voiture, {foreignKey: "voitureId" });

db.emp.hasMany(db.reparation, {foreignKey: 'employeId' });

db.marque.hasOne(db.voiture, {foreignKey: "marqueId"});
db.voiture.belongsTo(db.marque, {foreignKey: "marqueId"});

db.marque.hasOne(db.piece, {foreignKey: "marqueId"});
db.piece.belongsTo(db.marque, {foreignKey: "marqueId"});

db.typereparation.hasOne(db.reparation, {foreignKey: "typereparationId"})

db.piece.belongsToMany(db.reparation, { through: 'reparation_has_piece', foreignKey: "pieceId" });
db.reparation.belongsToMany(db.piece, { through: 'reparation_has_piece', foreignKey: "reparationId" });

db.piece.belongsToMany(db.fornissuer, {through: 'fournisser_has_piece', as: 'fornisserhaspieces', foreignKey: "pieceId"});
db.fornissuer.belongsToMany(db.piece, {through: 'fournisser_has_piece', as: 'fornisserhaspieces',foreignKey: "fornissuerId"});

db.client.hasMany(db.paiement,{foreignKey: "clientId"});
db.reparation.hasOne(db.paiement,{foreignKey: "reparationId"});



db.dbinfo = dbinfo;
db.Sequelize = Sequelize;

//créer les table

//dbinfo.sync({ force: true });


module.exports = db
