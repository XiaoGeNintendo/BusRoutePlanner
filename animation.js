var currentRoute=0;
var interpolating=false;
var animationMarker=null;
var SPEED=3000;
var nextPassStation=0;

function doAnimation(){
    const r=route[currentRoute];

    console.log("DoAnimation:",currentRoute,interpolating,r);

    if(interpolating){
        $.toast({message:"前往下一程开始点："+route[currentRoute+1].start_station});
        console.log([r.polyline[r.polyline.length-1],route[currentRoute+1].polyline[0]]);
        setTimeout(()=>{
            animationMarker.moveAlong([r.polyline[r.polyline.length-1],route[currentRoute+1].polyline[0]],{speed:SPEED,autoRotation:true});
        },500);
        
    }else{
        $.toast({message:`第${currentRoute+1}程：${r.via}从${r.start_station}前往${r.end_station}`});
        console.log(r.polyline);
        setTimeout(()=>{

            animationMarker.moveAlong(r.polyline,{
                speed:SPEED,
                autoRotation:true
            });
        },500);
    }
}

function startAnimation(){
    if(animationMarker!=null){
        animationMarker.stopMove();
        animationMarker.remove();
        animationMarker=null;
    }

    if(route.length==0){
        $.toast({message:"请先添加路线"});
        return;
    }

    currentRoute=0;
    interpolating=false;
    nextPassStation=0;

    animationMarker = new AMap.Marker({
        map: map,
        position: route[0].polyline[0],
        icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
        offset: new AMap.Pixel(-13, -26),
    });

    animationMarker.on('moveend',(e)=>{

        route[currentRoute].passes.forEach(element => {
            // console.log(element,animationMarker.getPosition());
            if(animationMarker.getPosition().equals([element.location[0],element.location[1]])){
                // animationMarker.pauseMove();
                // setTimeout(()=>{
                //     animationMarker.resumeMove();
                // },250);
                // map.trigger('resize');
                map.resize();
                $.toast({message:`正在经过${element.name}`});
            }
        });
    });

    animationMarker.on('movealong',(e)=>{
        // console.log("Hit");
        if(!interpolating){
            interpolating=true;
            doAnimation();
        }else{
            currentRoute++;
            interpolating=false;
            if(currentRoute==route.length){
                $.toast({class:"success",message:"动画完成！"});
            }else{
                doAnimation();
            }
        }
    });

    animationMarker.on('moving', function (e) {
        map.setCenter(e.target.getPosition())
    });

    map.setZoom(12);
    setTimeout(doAnimation, 500);
}