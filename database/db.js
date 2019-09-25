/************************************** Start Require module ****************************************************
*****************************************************************************************************************/
/**
 * Sequelize is a promise-based ORM for Node.js.
 * Sequelize is easy to learn and has dozens of cool features like synchronization, association, validation, etc.
 * It also has support for PostgreSQL, MySQL, MariaDB, SQLite, and MSSQL.
 * I am assuming you have some form of SQL database service started on your machine. I am currently using MySQL.
 * */
const Sequelize = require('sequelize');


/************************************** end Require module **********************************************
 *******************************************************************************************************************/


/************************************** Start connexion to database  **********************************************
 *****************************************************************************************************************/
// make our const db ;
const db ={};

// conn to database
/**
 * new Sequelize({database},{username},{password},options{
 *     host:{hostname},
 *     dialect:  one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' , The dialect of the database you are connecting to. One of mysql, postgres, sqlite and mssql.
 *     port: if you don't have change you mysql default port it will 3306, or if you change make sure to use you port ,
 *     operatorsAliases: {false},
 *     pool: { sequelize connection pool configuration
 *         max: { 5 numbre of max conn in you database}, Maximum number of connection in pool default: 5
 *         min: {0 } Minimum number of connection in pool,default: 0,
 *         acquire: {30000 } The maximum time, in milliseconds, that pool will try to get connection before throwing error, default 60000,
 *         idle: { 10000 } The maximum time, in milliseconds, that a connection can be idle before being released.
 *     }
 *
 * @type {Sequelize}
 */

const dbinfo = new Sequelize("garager","root","root",{
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    operatorsAliases: false,
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle: 10000,
    }

});
dbinfo.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


/************************************** end connexion to database **********************************************
 *****************************************************************************************************************/

//models/tables
/**
 *
 ************************************** Start Require models/tables **********************************************
 *****************************************************************************************************************
 *
 *

 * require every table in database
 * we need it in this file to make  associations
 * we all so require the associations table we make , we need some data in that table
 *
 */
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

/************************************** End block  Require models/tables **********************************************
***********************************************************************************************************************


/**
 * There are four type of associations available in Sequelize
 *
 * BelongsTo     :  associations are associations where the foreign key for the one-to-one relation exists on the source model.
 * HasOne        :  associations are associations where the foreign key for the one-to-one relation exists on the target model.
 * HasMany       :  associations are connecting one source with multiple targets. The targets however are again connected to exactly one specific source.
 * BelongsToMany :  associations are used to connect sources with multiple targets. Furthermore the targets can also have connections to multiple sources.
 *
 ************************************** Start Relation **********************************************
 ***********************************************************************************************
 *
 *  the garage can have Many atelier : atelier: 1,1  garage : 1,N
 */
db.garage.hasMany(db.atelier,{foreignKey: "garageId"});

db.atelier.hasOne(db.emp,{foreignKey: "atelierId"});

// this voiture has this client
db.client.hasMany(db.voiture,{foreignKey: "clientId"});
db.voiture.belongsTo(db.client,{foreignKey: "clientId"});

// this voiture can have many reparation
db.voiture.hasMany(db.reparation, {foreignKey: "voitureId" });
// this reparation is for this voiture
db.reparation.belongsTo(db.voiture, {foreignKey: "voitureId" });

// this emp make this reparation
db.emp.hasMany(db.reparation, {foreignKey: 'employeId' });

//voiture has one marque
db.marque.hasOne(db.voiture, {foreignKey: "marqueId"});
// marque go to in voiture
db.voiture.belongsTo(db.marque, {foreignKey: "marqueId"});

// this piece has one marque
db.marque.hasOne(db.piece, {foreignKey: "marqueId"});
// marque go to in pieces
db.piece.belongsTo(db.marque, {foreignKey: "marqueId"});

db.typereparation.hasOne(db.reparation, {foreignKey: "typereparationId"});

// many to many 1,N ET 1,N
db.piece.belongsToMany(db.reparation, { through: 'reparation_has_piece', foreignKey: "pieceId" });
db.reparation.belongsToMany(db.piece, { through: 'reparation_has_piece', foreignKey: "reparationId" });
// many to many 1,N ET 1,N
db.piece.belongsToMany(db.fornissuer, {through: 'fournisser_has_piece', as: 'fornisserhaspieces', foreignKey: "pieceId"});
db.fornissuer.belongsToMany(db.piece, {through: 'fournisser_has_piece', as: 'fornisserhaspieces',foreignKey: "fornissuerId"});


db.client.hasMany(db.paiement,{foreignKey: "clientId"});
db.reparation.hasOne(db.paiement,{foreignKey: "reparationId"});

/**************************************************** End of block Relation ***************************************************
*******************************************************************************************************************************/

db.dbinfo = dbinfo;
db.Sequelize = Sequelize;


/**
 * Sync all defined models to the DB.
 * similar for sync: you can define this to always force sync for models
  */

//dbinfo.sync({ force: true });

/**
 * The module.exports or exports is a special object which is included in every JS file in the Node.js application by default.
 * module is a variable that represents current module and exports is an object that will be exposed as a module.
 * So, whatever you assign to module.exports or exports, will be exposed as a module.
**/
module.exports = db;
