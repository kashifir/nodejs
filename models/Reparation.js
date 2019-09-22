module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_reparation",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            date_de_reparations: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            },
            temps_de_reparations: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            prixtotal: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            }

        },
        {
            timestamps: true,
            underscored: true
        }
    );
}

