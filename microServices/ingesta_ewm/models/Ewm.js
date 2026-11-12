const Sequelize = require('sequelize');

class Ewm extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id_ewm: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    field: 'id',
                },
                orderNo: {
                    type: DataTypes.CHAR(30),
                    allowNull: false,
                    field: 'orderNo',
                },
                sku: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                },
                quantity: {
                    type: DataTypes.CHAR(20),
                    allowNull: false,
                    field: 'quantity',
                },
                lgNum: {
                    type: DataTypes.CHAR(20),
                    allowNull: false,
                    field: 'lgNum',
                },
                odoDocNo: {
                    type: DataTypes.CHAR(100),
                    allowNull: false,
                    field: 'odoDocNo',
                },
                pgiDat: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'pgiDat'
                },
                idoDocNo: {
                    type: DataTypes.CHAR(100),
                    allowNull: false,
                    field: 'idoDocNo',
                },
                routeId: {
                    type: DataTypes.CHAR(20),
                    allowNull: false,
                    field: 'routeId',
                },
                pickSt: {
                    type: DataTypes.CHAR(20),
                    allowNull: false,
                    field: 'pickSt',
                },
                pickDat: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'pickDat',
                },
                pgiSt: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'pgiSt',
                },
                pgrDat: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'pgrDat',
                },
                odoDat: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'odoDat',
                },
                idoDat: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'idoDat',
                },
                utPgi: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'utPgi',
                },
                utPgr: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'utPgr',
                },
                doctTypeOdo: {
                    type: DataTypes.CHAR(30),
                    allowNull: false,
                    field: 'doctTypeOdo',
                },
                doctTypeIdo: {
                    type: DataTypes.CHAR(30),
                    allowNull: false,
                    field: 'doctTypeIdo',
                },
                itemTypeOdo: {
                    type: DataTypes.CHAR(30),
                    allowNull: false,
                    field: 'itemTypeOdo',
                },
                manifEnt: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'manifEnt',
                },
                manifSal: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'manifSal',
                },
                lpTu: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'lpTu',
                },
                huident: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'huident',
                },
                lpStat: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'lpStat',
                },
                lgNumOri: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'lgNumOri',
                },
                lgNumDes: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'lgNumDes',
                },
                userPgr: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'userPgr',
                },
                userPgi: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'userPgi',
                },
                logMsj: {
                    type: DataTypes.CHAR(100),
                    allowNull: false,
                    field: 'logMsj',
                },
                logDat: {
                    type: DataTypes.CHAR(100),
                    allowNull: false,
                    field: 'logDat',
                },
                logH: {
                    type: DataTypes.CHAR(100),
                    allowNull: false,
                    field: 'logH',
                },
                skuTxt: {
                    type: DataTypes.CHAR(100),
                    allowNull: false,
                    field: 'skuTxt',
                },
                dpcSt: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'dpcSt',
                },
                trace: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'trace',
                },
                lgNumDTxt: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'lgNumDTxt',
                },
                partyNo: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'partyNo',
                },
                utSrActNumt: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'utSrActNumt',
                },
                utLicPlate: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'utLicPlate',
                },
                pgrSt: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'pgrSt',
                },
                uiQuan: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'uiQuan',
                },
                level:{
                    type: DataTypes.CHAR(50),
                    allowNull: true,
                    field: 'level'
                },
                fcreacion: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                factualizacion: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                sequelize,
                tableName: 'ewm',
                schema: 'cnpao',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                ],
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => Ewm.init(sequelize, DataTypes);
