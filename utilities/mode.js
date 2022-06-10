module.exports = function mode(arr){
    var obj = {};
    var max;
    var maxValue = Number.MIN_VALUE;
    for(let e of arr){
        obj[e] = obj[e]?obj[e]+1:1;
        if(obj[e]>=maxValue){
            max = e;
            maxValue = obj[e];
        }
    }
    return max;
}