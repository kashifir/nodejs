module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_typereparation",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            type_reparation: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
        },
        {
            timestamps: true,
            underscored: true
        }
    );
}

