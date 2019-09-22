module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_piece",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            ref_piece: {
                type: Sequelize.DataTypes.STRING(45),
                unique: true
            },
            name:{
                type: Sequelize.DataTypes.STRING(45),
                allowNull: false
            },
            modele: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: false
            },
            type_moteur: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: false
            },
            prix: {
                type: Sequelize.DataTypes.DECIMAL(7,2),
                allowNull: false
            },
            stock:{
                type: Sequelize.DataTypes.INTEGER(4),
                allowNull: false
            },
        },
        {
            timestamps: true,
            underscored: true
        }
    );
};

