
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "fournisser_has_piece",
        {
            quantite:{
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            prix:{
                type: Sequelize.DataTypes.DECIMAL(7,2),
                allowNull: false
            }
        }
    );
}

