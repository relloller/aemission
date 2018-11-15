'use strict'; 
function objHasProp(obj) {
    return (typeof obj === 'object' && Object.keys(obj).length > 0);
}


function cloneMixed(obj) {
    let objTemp;
    if (Array.isArray(obj)) {
        objTemp = [];
        for (let i = 0; i < obj.length; i++) {
            if (Array.isArray(obj[i]) || objHasProp(obj[i])) objTemp.push(cloneMixed(obj[i]));
            else objTemp.push(obj[i]);
        }
    }
    else if (objHasProp(obj)) {
        objTemp={};
        for (let p in obj) {
            if (Array.isArray(obj[p]) || objHasProp(obj[p])) objTemp[p] = cloneMixed(obj[p])
            else objTemp[p] = obj[p];
        }
    }
    return objTemp;
}


module.exports = cloneMixed;
