module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_client",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: false
            },
            prenom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: false
            },
            email: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: false
            },
            tel: {
                type: Sequelize.DataTypes.STRING(15),
                allowNull: false
            },
        },
        {
            timestamps: true,
            underscored: true
        }
    );
}

