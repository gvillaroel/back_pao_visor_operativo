const deleteKeysWithEmptyValues = (obj) => {
    for (const key in obj) {
        if (obj[key] === '' || obj[key] === ' ' || obj[key] === undefined || obj[key] === null) {
            delete obj[key];
        }
    }
    return obj;
}

exports.newSiebelObject = (siebelObject) => {
    const newSiebel =  {
        strDirContacto: siebelObject.strDirContacto ?? null,
        strNombreContacto: siebelObject.strNombreContacto  ?? null,
        strFecApertura: siebelObject.strFecApertura  ?? null,
        strUltimaModificacion: siebelObject.strUltimaModificacion  ?? null,
        strActualizadoPor: siebelObject.strActualizadoPor  ?? null,
        strResumen: siebelObject.strResumen  ?? null,
        strTipoLlamada: siebelObject.strTipoLlamada  ?? null,
        strFecCierre: siebelObject.strFecCierre  ?? null,
        strFecCompromiso: siebelObject.strFecCompromiso  ?? null,
        strCreadoPor: siebelObject.strCreadoPor  ?? null,
        strDetalle: siebelObject.strDetalle  ?? null,
        strCategoria: siebelObject.strCategoria  ?? null,
        strArea: siebelObject.strArea  ?? null,
        strSubcategoria: siebelObject.strSubcategoria  ?? null,
        strEdoGarantia: siebelObject.strEdoGarantia  ?? null,
        strModelo: siebelObject.strModelo  ?? null,
        strProveedor: siebelObject.strProveedor  ?? null,
        strMarca: siebelObject.strMarca  ?? null,
        strMotivoCancelacion: siebelObject.strMotivoCancelacion  ?? null,
        strMotivoCierre: siebelObject.strMotivoCierre  ?? null,
        strTelContacto: siebelObject.strTelContacto  ?? null,
        strEmailContacto: siebelObject.strEmailContacto  ?? null,
        strGrupo: siebelObject.strGrupo  ?? null,
        strSKU: siebelObject.strSKU  ?? null,
        strDescripcionSKU: siebelObject.strDescripcionSKU  ?? null,
        strOrdenVenta: siebelObject.strOrdenVenta  ?? null,
        strSolucion: siebelObject.strSolucion  ?? null,
        strFechaSol: siebelObject.strFechaSol  ?? null,
        strMotivoSolucion: siebelObject.strMotivoSolucion  ?? null,
        strSubMotivoSolucion: siebelObject.strSubMotivoSolucion  ?? null,
        strMedioContacto: siebelObject.strMedioContacto  ?? null,
        strSubEdo: siebelObject.strSubEdo  ?? null,
        strTicketCompra: siebelObject.strTicketCompra  ?? null,
        strTipoCategoria: siebelObject.strTipoCategoria  ?? null,
        strPropietario: siebelObject.strPropietario  ?? null,
        strPrioridad: siebelObject.strPrioridad  ?? null,
        strFecCompra: siebelObject.strFecCompra  ?? null,
        strAlmacenCompra: siebelObject.strAlmacenCompra  ?? null,
        strIdSS: siebelObject.strIdSS  ?? null,
        strNoSS: siebelObject.strNoSS  ?? null,
        strNumSerie: siebelObject.strNumSerie  ?? null,
        strFecEntrega: siebelObject.strFecEntrega  ?? null,
        strStatusSS: siebelObject.strStatusSS  ?? null,
    };
    return deleteKeysWithEmptyValues(newSiebel);
};

