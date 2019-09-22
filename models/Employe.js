module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_emp",
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
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                SELECT: false
            },
            competences:{
                type: Sequelize.DataTypes.TEXT,
                allowNull: false
            },
            poste:{
                type: Sequelize.DataTypes.STRING(60),
                allowNull: false
            }
        },
        {
            timestamps: true,
            underscored: true
        }
    );
}

