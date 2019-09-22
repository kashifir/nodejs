module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_garage",
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
            adresse: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false
            },
            cp: {
                type: Sequelize.DataTypes.INTEGER(5),
                allowNull: false
            },
            ville: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: false,
                SELECT: false
            },
            tel:{
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

