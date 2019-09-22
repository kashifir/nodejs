
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "fournisser_has_piece",
        {
            quantite:{
                type: Sequelize.DataTypes.STRING,
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            prix:{
                type: Sequelize.DataTypes.DECIMAL(7,2),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            }
        }
    );
};

