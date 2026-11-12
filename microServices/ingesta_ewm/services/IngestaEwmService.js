const db = require('../config/db');
const Schema = require('../models/init-models');
const {
  DeepCopy,
  AreEqualJson
} = require('../utils/JsonHelpers');
const { CREATE_EWM, UPDATE_EWM, FIND_EWM_ORDER_IN, FIND_EWM_ORDER, FETCH_ALL_EWM_BY_SKU_AND_ORDER } = require('../repositories/IngestaEwmRepository');

exports.CREATE_OR_UPDATE_EWM = async (data, newIntegracion) =>{
  const payload = data
  if(Array.isArray(payload.data)){
    const dataList = await BuildInsertData( payload )
    if(dataList.data && dataList.data.length > 0){
      const orderNumbers =  dataList.data.map(x=> x.orderNo)
      // const results = await FIND_EWM_ORDER_IN(orderNumbers)
      for (const element of dataList.data){
        await CREATE_EWM(element, newIntegracion.dataValues.IDIntegracion)
        /* const model = results.find(x=> x.orderNo === element.orderNo)
        if (!model){
          await CREATE_EWM(element, newIntegracion.dataValues.IDIntegracion)
        }else{
          await UPDATE_EWM(element, newIntegracion.dataValues.IDIntegracion, model)
        } */

      }
      return await FIND_EWM_ORDER_IN(orderNumbers)
    }

  }else{
    const result = await FIND_EWM_ORDER(payload.orderNo)
    if (!result) await CREATE_EWM(payload, newIntegracion.dataValues.IDIntegracion)
    else  await UPDATE_EWM(payload, newIntegracion.dataValues.IDIntegracion)
    return await FIND_EWM_ORDER(payload.orderNo)
  }

}

const BuildInsertData = async (payload) => {
  if (Array.isArray(payload.data)) {
    /* Data for store the processed data */
    const fixedData = [];
    const xEwm = payload.xEwm
    /* Check every single data on payload */
    for (const data of payload.data) {
      /* Get the level (Shipment / order / orderLine / TO=transferObject ) */
      data.level = payload.node.nodo;

      /* The third party request returns order instead orderNo, so we replace it for orderNo */
      if (data.hasOwnProperty('order')) {
        const orderNo = data.order;
        delete data.order;
        data.orderNo = orderNo;
      }

      /* Flag to check if the element should be add to tables or not */
      let shouldPush = true;

      /* Check if the initial request got elements, if not, the data should be add to tables */
      if (xEwm && xEwm.length > 0) {
        /* Filter the data to the current working level */
        const filterNodeEwm = xEwm.filter(x => x.level === data.level && x.sku === data.sku);

        /* If the filter got elements, should be processed */
        if (filterNodeEwm.length > 0) {

          /* Just want the last element added cuz is the last updated element */
          const lastEwm = filterNodeEwm.reduce((a, b) => a.id_ewm > b.id_ewm ? a : b);
          /* Make a deep copy to avoid change the original data */
          const objComparable = DeepCopy(lastEwm);

          /* The third party request does not return id, so we need to remove it from out DB data for compare the two JSONS */
          if (objComparable.hasOwnProperty('id_ewm')) {
            delete objComparable.id_ewm;
          }

          /* If the data is the same, nothing change, so we need to put the flag on false for non add the data to the payload */
          if (AreEqualJson(data, objComparable)) {
            shouldPush = false;
          }
        } else {
          /* If the original sku does not have elements, maybe is another SKU, so we need to check it  */
          const alternativeEwm = await FETCH_ALL_EWM_BY_SKU_AND_ORDER(data.sku, data.orderNo);
          /* Filter the data to the alternative sku and level  */
          const filterNodeEwm = alternativeEwm.filter(x => x.level === data.level && x.sku === data.sku);

          /* Check the alternative sku exist  */
          if (filterNodeEwm && filterNodeEwm.length > 0) {
            /* Just want the last element added cuz is the last updated element */
            const lastEwm = filterNodeEwm.reduce((a, b) => a.id_ewm > b.id_ewm ? a : b);

            /* Make a deep copy to avoid change the original data */
            const objComparable = DeepCopy(lastEwm);

            /* The third party request does not return id, so we need to remove it from out DB data for compare the two JSONS */
            if (objComparable.hasOwnProperty('id_ewm')) {
              delete objComparable.id_ewm;
            }

            /* If the data is the same, nothing change, so we need to put the flag on false for non add the data to the payload */
            if (AreEqualJson(data, objComparable)) {
              shouldPush = false;
            }
          }
        }
      }

      /* If the flag is true, the data should be add to payload */
      if (shouldPush) {
        fixedData.push(data);
      }
    }
    payload.data = fixedData;
  }
  return payload
}
/**
 * Obtiene los valores del body y los prepara para el repositorio de  insercion a cxcec
 * @param {*} body
 */
/*
exports.SaveIngestaEwmService = async (body) => {
  try {
    const ingestaEwmInstance = await GetInstance(body);
    // return await SaveEwm(ingestaEwmInstance);
  } catch (error) {
    console.error('Error saving IngestaEwm:', error);
    throw error;
  }
}; */
/*
const GetInstance = async (body) => {
  const instance = new Ewm({
    orderNo: body.orderNo,
    sku: body.sku,
    quantity: body.quantity,
    lgNum: body.lgNum,
    odoDocNo: body.odoDocNo,
    idoDocNo: body.idoDocNo,
    routeId: body.routeId,
    pickSt: body.pickSt,
    pickDat: body.pickDat,
    pgiSt: body.pgiSt,
    pgiDat: body.pgiDat,
    pgrSt: body.pgrSt,
    pgrDat: body.pgrDat,
    odoDat: body.odoDat,
    idoDat: body.idoDat,
    utPgi: body.utPgi,
    utPgr: body.utPgr,
    doctTypeOdo: body.doctTypeOdo,
    doctTypeIdo: body.doctTypeIdo,
    itemTypeOdo: body.itemTypeOdo,
    manifEnt: body.manifEnt,
    manifSal: body.manifSal,
    lpTu: body.lpTu,
    huident: body.huident,
    lpStat: body.lpStat,
    lgNumOri: body.lgNumOri,
    lgNumDes: body.lgNumDes,
    userPgr: body.userPgr,
    userPgi: body.userPgi,
    logMsj: body.logMsj,
    logDat: body.logDat,
    logH: body.logH,
    skuTxt: body.skuTxt,
    dpcSt: body.dpcSt,
    trace: body.trace,
    lgNumDTxt: body.lgNumDTxt,
    partyNo: body.partyNo,
    utSrActNumt: body.utSrActNumt,
    utLicPlate: body.utLicPlate,
    uiQuan: body.uiQuan,
  });

  return instance.dataValues;
};
*/
