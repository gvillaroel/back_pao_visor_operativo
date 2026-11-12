exports.AreEqualJson = (obj1, obj2) => {
    const sortedJson1 = JSON.stringify(obj1, Object.keys(obj1).sort());
    const sortedJson2 = JSON.stringify(obj2, Object.keys(obj2).sort());
    return sortedJson1 === sortedJson2;
}

exports.DeepCopy = (obj) =>{
    return JSON.parse(JSON.stringify(obj));
}


exports.NormalizePropertyNames = (obj) => {
    const normalizedObj = {};
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const normalizedKey = key.replaceAll(/&|-/g,  '_');
            normalizedObj[normalizedKey] = obj[key];
        }
    }
    return normalizedObj;
}


exports.AreObjectsEqual = (obj1, obj2) =>{
    // Obtenemos las claves de ambos objetos
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (!obj2.hasOwnProperty(key) || obj1[key] != obj2[key]) {
            return false;
        }
    }

    // Si todas las propiedades coinciden, los objetos son iguales
    return true;
}



