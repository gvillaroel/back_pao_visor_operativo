exports.AreEqualJson = (obj1, obj2) => {
    const sortedJson1 = JSON.stringify(obj1, Object.keys(obj1).sort());
    const sortedJson2 = JSON.stringify(obj2, Object.keys(obj2).sort());
    return sortedJson1 === sortedJson2;
}

exports.DeepCopy = (obj) =>{
    return JSON.parse(JSON.stringify(obj));
}

