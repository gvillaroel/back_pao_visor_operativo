const Sequelize = require('sequelize');

class Apikeys extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id_key: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: 'id_key',
        },
        nombre: {
          type: DataTypes.CHAR(15),
          allowNull: false,
        },
        api_key: {
          type: DataTypes.CHAR(255),
          allowNull: false,
        },
        create_user: {
          type: DataTypes.CHAR(500),
          allowNull: true,
        },
        create_time: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        permitir: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        update_user: {
          type: DataTypes.CHAR(500),
          allowNull: true,
        },
        update_time: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'api_keys',
        schema: 'cnpao',
        timestamps: false,
      },
    );
  }
}

module.exports = (sequelize, DataTypes) => Apikeys.init(sequelize, DataTypes);
