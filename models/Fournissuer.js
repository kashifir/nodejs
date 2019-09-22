module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_fournissuer",
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
            email: {
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

