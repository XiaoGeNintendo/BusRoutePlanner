var AMap=null;
var map=null;

var showPassMarker=false;

function compare1(first, second){
    return Math.abs(first-second)<=1e-7;
}

function compare2(first, second){
    return compare1(first[0],second[0]) && compare1(first[1],second[1]);
}

function initializeMap(key, passcode, callback){
    window._AMapSecurityConfig = {
        securityJsCode: passcode,
    };
    AMapLoader.load({
        key: key, //申请好的Web端开发者 Key，调用 load 时必填
        version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
      })
        .then((__amap) => {
            AMap=__amap;
            $.toast({class:"success",message:"载入地图组件成功"});

            callback();
        })
        .catch((e) => {
            $.toast({class:'error',message:"载入地图失败，请检查你的高德地图密钥"});
        });
}