module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_marque",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            marque: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: false
            },
        },
        {
            timestamps: true,
            underscored: true
        }
        )
}
