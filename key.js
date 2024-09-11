function removeKey(){
    localStorage.removeItem("amap_key");
    localStorage.removeItem("amap_code");
    location.reload();
}

function updateKey(){
    localStorage["amap_key"]=$('#amap_key').val();
    localStorage["amap_code"]=$('#amap_code').val();
    location.reload();
}

var key=localStorage["amap_key"];
var code=localStorage["amap_code"];
if(!(key && code)){
    $.toast({class:"warning",message:"未配置高德地图API，所有功能将不会生效！"})
}else{
    $.toast({message:"使用key:"+key});

    initializeMap(key,code, function(){
        AMap.plugin('AMap.LineSearch',function(){});
        AMap.plugin('AMap.PlaceSearch',function(){});
        map=new AMap.Map("map");
        validateRoute();
        updateRoute();
    });
}