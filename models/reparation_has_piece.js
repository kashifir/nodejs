
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "reparation_has_piece",
        {
            quantite:{
                type: Sequelize.DataTypes.STRING
            }
        }
    );
}

