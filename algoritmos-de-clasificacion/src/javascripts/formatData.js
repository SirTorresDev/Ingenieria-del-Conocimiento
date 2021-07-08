
export const basesIni = (bases) => {
    let array = [];
    let stringBaseIni;
    for(let base in bases){
        stringBaseIni = "\n" + (parseFloat(base)+ 1) + ". [";
        let data = bases[base];
        data = data.map(element => parseFloat(element).toFixed(1));
        stringBaseIni = stringBaseIni + data + "]";
        array.push(stringBaseIni);
    }
    return array;
}

export const formatMatrix = (bases) => {
    debugger
    let array = [];
    let stringBaseIni;
    for(let base in bases){
        stringBaseIni = "\n" + "  (";
        let data = bases[base];
        data = data.map(element => parseFloat(element).toFixed(3));
        stringBaseIni = stringBaseIni + data + ")";
        array.push(stringBaseIni);
    }
    return array;
}

export const roundDecimals = (initValue, numDecimals) => {
    let result;
    result = initValue;
    result =  result *  Math.pow(10, numDecimals);
    result = Math.floor(result);
    result = result / Math.pow(10, numDecimals);
    return result;
}

export const formatCenters = (centros) => {
    let result = centros.slice(5,centros.length-1);
    result = result.toString().split(",");
    return result;
}

export const formatCentersFinal = (centros) => {
    let array = [];
    for(let i = 0; i < centros.length; i++){
        let result = centros[i].slice(5,centros[i].length-1);
        result = result.toString().split(",");
        array.push(result);
    }
    return array;
}

export const formatResult = (result) => {
    return result.split(",");
}
