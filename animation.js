var currentRoute=0;
var interpolating=false;
var animationMarker=null;
var SPEED=3000;
var nextPassStation=0;

function doAnimation(){
    const r=route[currentRoute];

    console.log("DoAnimation:",currentRoute,interpolating,r);

    if(interpolating){
        if(currentRoute===route.length-1){
            return;
        }

        if(route[currentRoute+1].start_station===r.end_station) {
            showLcdWithMove("");
        }else{
            showLcdWithMove(route[currentRoute + 1].start_station);
        }

        $.toast({message:"前往下一程开始点："+route[currentRoute+1].start_station});
        console.log([r.polyline[r.polyline.length-1],route[currentRoute+1].polyline[0]]);
        setTimeout(()=>{
            animationMarker.moveAlong([r.polyline[r.polyline.length-1],route[currentRoute+1].polyline[0]],{speed:SPEED,autoRotation:true});
        },500);
        
    }else{
        showLcdWithLine(r)

        $.toast({message:`第${currentRoute+1}程：${r.via}从${r.start_station}前往${r.end_station}`});
        console.log(r.polyline);
        setTimeout(()=>{

            //special case for single point routes
            let pl=r.polyline
            if(pl.length===1){
                pl=[pl[0],pl[0]];
            }

            animationMarker.moveAlong(pl,{
                speed:SPEED,
                autoRotation:true
            });
        },500);
    }
}

function readAnimationConfig(){
    SPEED = parseInt($('#animation_speed').val())*3000;
    LCD_SPACING= parseInt($('#lcd_spacing').val());
    LCD_TWO_SIDE= $('#lcd_vertical').is(':checked');
    ANIMATION_TIME= parseFloat($('#animation_time').val());

    console.log("Animation Config:",SPEED,LCD_SPACING,LCD_TWO_SIDE, ANIMATION_TIME);
}

function startAnimation(){

    readAnimationConfig();

    if(animationMarker!=null){
        animationMarker.stopMove();
        animationMarker.remove();
        animationMarker=null;
    }

    if(route.length===0){
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

        route[currentRoute].passes.forEach((element,index) => {
            // console.log(element,animationMarker.getPosition());
            if(animationMarker.getPosition().equals([element.location[0],element.location[1]])){
                // animationMarker.pauseMove();
                // setTimeout(()=>{
                //     animationMarker.resumeMove();
                // },250);
                // map.trigger('resize');
                // map.resize();

                passLcd(index)
                // $.toast({message:`正在经过${element.name}`});
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
    showLcd();
    setTimeout(function(){
        //scroll to page top
        $('html, body').animate({ scrollTop: 0 }, 'fast');},500);

}