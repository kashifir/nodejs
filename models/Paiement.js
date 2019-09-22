module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_paiement",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            prixtotal: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true
            },
            typepaiemet: {
                type: Sequelize.DataTypes.ENUM("cd","chèque", "espèces")
            }
        },
        {
            timestamps: true,
            underscored: true
        }
    );
}

