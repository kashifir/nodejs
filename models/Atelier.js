module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_atelier",
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
        },
        {
            timestamps: true,
            underscored: true
        }
    );
}

