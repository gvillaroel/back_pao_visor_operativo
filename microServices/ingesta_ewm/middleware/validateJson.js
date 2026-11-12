function deleteKeysWithEmptyValues(obj) {
    for (const key in obj) {
        if (obj[key] === '' || obj[key] === ' ' || obj[key] === undefined || obj[key] === null) {
            delete obj[key];
        }
    }
    return obj;
}
const ewmJSON = (
    data,
) => {
    const clienteInfo = data;
    const jsonCliente = {
        orderNo: clienteInfo?.orderNo ? clienteInfo.orderNo : clienteInfo?.order ? clienteInfo.order :  null,
        sku: clienteInfo?.sku ?? null,
        quantity: clienteInfo?.quantity ?? null,
        lgNum: clienteInfo?.lgNum ?? null,
        odoDocNo: clienteInfo?.odoDocNo ?? null,
        pgiDat: clienteInfo?.pgiDat ?? null,
        idoDocNo: clienteInfo?.idoDocNo ?? null,
        routeId: clienteInfo?.routeId ?? null,
        pickSt: clienteInfo?.pickSt ?? null,
        pickDat: clienteInfo?.pickDat ?? null,
        pgiSt: clienteInfo?.pgiSt ?? null,
        pgrDat: clienteInfo?.pgrDat ?? null,
        odoDat: clienteInfo?.odoDat ?? null,
        idoDat: clienteInfo?.idoDat ?? null,
        utPgi: clienteInfo?.utPgi ?? null,
        utPgr: clienteInfo?.utPgr ?? null,
        doctTypeOdo: clienteInfo?.doctTypeOdo ?? null,
        doctTypeIdo: clienteInfo?.doctTypeIdo ?? null,
        itemTypeOdo: clienteInfo?.itemTypeOdo ?? null,
        manifEnt: clienteInfo?.manifEnt ?? null,
        manifSal: clienteInfo?.manifSal ?? null,
        lpTu: clienteInfo?.lpTu ?? null,
        huident: clienteInfo?.huident ?? null,
        lpStat: clienteInfo?.lpStat ?? null,
        lgNumOri: clienteInfo?.lgNumOri ?? null,
        lgNumDes: clienteInfo?.lgNumDes ?? null,
        userPgr: clienteInfo?.userPgr ?? null,
        userPgi: clienteInfo?.userPgi ?? null,
        logMsj: clienteInfo?.logMsj ?? null,
        logDat: clienteInfo?.logDat ?? null,
        logH: clienteInfo?.logH ?? null,
        skuTxt: clienteInfo?.skuTxt ?? null,
        dpcSt: clienteInfo?.dpcSt ?? null,
        trace: clienteInfo?.trace ?? null,
        lgNumDTxt: clienteInfo?.lgNumDTxt ?? null,
        partyNo: clienteInfo?.partyNo ?? null,
        utSrActNumt: clienteInfo?.utSrActNumt ?? null,
        utLicPlate: clienteInfo?.utLicPlate ?? null,
        pgrSt: clienteInfo?.pgrSt ?? null,
        uiQuan: clienteInfo?.uiQuan ?? null,
    };

    return deleteKeysWithEmptyValues(jsonCliente);
};
const ewmJSONFull = (
    data,
) => {
    const clienteInfo = data;
    const jsonCliente = {
        orderNo: clienteInfo?.orderNo ? clienteInfo.orderNo : clienteInfo?.order ? clienteInfo.order :  null,
        sku: clienteInfo?.sku ?? null,
        quantity: clienteInfo?.quantity ?? null,
        lgNum: clienteInfo?.lgNum ?? null,
        odoDocNo: clienteInfo?.odoDocNo ?? null,
        pgiDat: clienteInfo?.pgiDat ?? null,
        idoDocNo: clienteInfo?.idoDocNo ?? null,
        routeId: clienteInfo?.routeId ?? null,
        pickSt: clienteInfo?.pickSt ?? null,
        pickDat: clienteInfo?.pickDat ?? null,
        pgiSt: clienteInfo?.pgiSt ?? null,
        pgrDat: clienteInfo?.pgrDat ?? null,
        odoDat: clienteInfo?.odoDat ?? null,
        idoDat: clienteInfo?.idoDat ?? null,
        utPgi: clienteInfo?.utPgi ?? null,
        utPgr: clienteInfo?.utPgr ?? null,
        doctTypeOdo: clienteInfo?.doctTypeOdo ?? null,
        doctTypeIdo: clienteInfo?.doctTypeIdo ?? null,
        itemTypeOdo: clienteInfo?.itemTypeOdo ?? null,
        manifEnt: clienteInfo?.manifEnt ?? null,
        manifSal: clienteInfo?.manifSal ?? null,
        lpTu: clienteInfo?.lpTu ?? null,
        huident: clienteInfo?.huident ?? null,
        lpStat: clienteInfo?.lpStat ?? null,
        lgNumOri: clienteInfo?.lgNumOri ?? null,
        lgNumDes: clienteInfo?.lgNumDes ?? null,
        userPgr: clienteInfo?.userPgr ?? null,
        userPgi: clienteInfo?.userPgi ?? null,
        logMsj: clienteInfo?.logMsj ?? null,
        logDat: clienteInfo?.logDat ?? null,
        logH: clienteInfo?.logH ?? null,
        skuTxt: clienteInfo?.skuTxt ?? null,
        dpcSt: clienteInfo?.dpcSt ?? null,
        trace: clienteInfo?.trace ?? null,
        lgNumDTxt: clienteInfo?.lgNumDTxt ?? null,
        partyNo: clienteInfo?.partyNo ?? null,
        utSrActNumt: clienteInfo?.utSrActNumt ?? null,
        utLicPlate: clienteInfo?.utLicPlate ?? null,
        pgrSt: clienteInfo?.pgrSt ?? null,
        uiQuan: clienteInfo?.uiQuan ?? null,
        level: clienteInfo?.level ?? null,
    };

    return jsonCliente
};
module.exports = { ewmJSON, ewmJSONFull };

