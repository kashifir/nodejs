module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_voiture",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            modele: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false
            },
            type_moteur: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: false
            },
            numero_plaque: {
                type: Sequelize.DataTypes.STRING(10),
                unique: true,
                allowNull: false
            },
            annee:{
                type: Sequelize.DataTypes.INTEGER(4),
                allowNull: false
            },
            couleur:{
                type: Sequelize.DataTypes.STRING(45),
                allowNull: false
            },
        },
        {
            timestamps: true,
            underscored: true
        }
    );
}

