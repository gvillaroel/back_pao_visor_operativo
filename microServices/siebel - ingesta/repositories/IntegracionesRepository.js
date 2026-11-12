const db = require('../config/db');
const Schema = require('../models/init-models');
const {  newSiebelObject } = require('../utils/siebelObject');
const { Sequelize } = require('sequelize');

const { Integraciones, Siebel } = Schema.default(db);

/**
 * Crea una integración en BD.
 *
 * @param integration {JSON} Información de una nueva integración
 * @return newIntegracion Regresa el registro de la integración en BD
 */
exports.CreateIntegration = async (integration) => {
  const integrationFound = await foundIntegration(
    integration?.JSONSistema?.strOrdenVenta,integration?.JSONSistema?.strSKU
  );
  if (integrationFound) {
    integration.MessageType = 'ORDER_SCHEDULED_UPDATED';
    const integrationCreated = await Integraciones.create(integration);
    await createSiebel(integrationCreated);

    return integration;
  } else {
    const integrationCreated = await Integraciones.create(integration);
    createSiebel(integration);
    return integrationCreated;
  }
};

const createSiebel = async (integration) => {
  const { strOrdenVenta } = integration.JSONSistema;
  const externalSiebel = integration.JSONSistema;

  const siebelFound = await Siebel.findOne({
    where: { strOrdenVenta },
  });

  if (siebelFound) {
    Object.entries(externalSiebel).forEach(([key, value]) => {
      externalSiebel[key] = emptyObjectVerify(
        value,
        siebelFound.dataValues[key]
      );
    });

    const siebelUpdate = await Siebel.update(newSiebelObject(externalSiebel), {
      where: { strOrdenVenta: externalSiebel.strOrdenVenta },
    });
    if (siebelUpdate[0] === 1) {
      await updateIntegrationStatus(integration.dataValues);
    }
  } else {
    const siabelCreated = await Siebel.create(
      newSiebelObject(integration.JSONSistema)
    );

    if (siabelCreated) {
      const intragrationFound = await foundIntegration(
        integration.JSONSistema.strOrdenVenta
      );
      await updateIntegrationStatus(intragrationFound);
    }
  }

  return integration.JSONSistema;
};

const emptyObjectVerify = (newValue, currentValue) => {
  let response = currentValue;
  let objValidate = null;
  if (typeof newValue === 'object') {
    objValidate = Object.entries(newValue ?? {}).length;
    console.log(objValidate);
  }
  if (
    newValue === '' ||
    newValue === undefined ||
    newValue === null ||
    objValidate === 0
  ) {
    response = currentValue;
  } else if (newValue !== currentValue) {
    response = newValue;
  }

  return response;
};

const foundIntegration = async (strOrdenVenta, strSKU) => {
  const integrationFound = await Integraciones.findOne({
    where: {
      [Sequelize.Op.and]: [
        { 'JSONSistema.strOrdenVenta': strOrdenVenta },
        { 'JSONSistema.strSKU': strSKU }
      ]
    },
    order: [['IDIntegracion', 'DESC']],
  });

  return integrationFound;
};

const updateIntegrationStatus = async (integration) => {
  const integrationUpdated = await Integraciones.update(
    {
      EstatusEjecucion: true,
      FchActualizacion: new Date(),
    },
    {
      where: {
        IDIntegracion: integration.IDIntegracion,
      },
    }
  );
  return integrationUpdated;
};
