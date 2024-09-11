
/**
 * The ultimate route data. Format:
 * 
 * start_station: String
 * end_station: String
 * via: String
 * color: String
 * passes: [String]
 * polyline: [pair]
 */
var route=[];

function removeRoute(index){
    route.splice(index,1);
    localStorage["brp_route"]=JSON.stringify(route);
    updateRoute();
}

function swapRoute(first, second){
    if(first<0 || first>=route.length){
        return;
    }
    if(second<0 || second>=route.length){
        return;
    }

    var tmp=route[second];
    route[second]=route[first];
    route[first]=tmp;
    localStorage["brp_route"]=JSON.stringify(route);
    updateRoute();
}

function colorRoute(index){
    const color=prompt('输入新颜色hex (例如：3f6fae)')
    if(!color){
        return;
    }

    route[index].color=color;
    localStorage["brp_route"]=JSON.stringify(route);
    updateRoute();
}

function validateRoute(){
    var fail=false;
    for(var i=0;i<route.length;i++){
        const r=route[i];
        if(!r){
            fail=true;
            break;
        }
    }
    if(fail){
        $.toast({class:'error',message:'发现数据损坏。请按重置按钮。'})
    }
}
function updateRoute(){
    map.clearMap();
    $('#list_line').html('');

    //update line marker
    route.forEach((r,index) => {

        if(r.start_station==r.end_station && r.via=="步行"){
            const template=`
<div class="title" style="color: #${r.color};">
<i class="dropdown icon"></i>
#${index+1}
<b>${r.start_station}</b>
<i class="walking icon"></i>
<a onclick="removeRoute(${index})" title="删除段"><i class="trash icon"></i></a>
<a onclick="swapRoute(${index-1},${index})" title="上移段"><i class="angle up icon"></i></a>
<a onclick="swapRoute(${index+1},${index})" title="下移段"><i class="angle down icon"></i></a>
</div>
<div class="content">
</div>`;
            $('#list_line').append(template);
            return;
        }
        const template=`
<div class="title" style="color: #${r.color};">
    <i class="dropdown icon"></i>
    #${index+1}
    <b>${r.start_station}</b>
    <i class="right arrow icon"></i>
    <b>${r.end_station}</b>
    <i class="bus icon"></i>
    <b>${r.via}</b>
    <a onclick="removeRoute(${index})" title="删除段"><i class="trash icon"></i></a>
    <a onclick="swapRoute(${index-1},${index})" title="上移段"><i class="angle up icon"></i></a>
    <a onclick="swapRoute(${index+1},${index})" title="下移段"><i class="angle down icon"></i></a>
    <a onclick="colorRoute(${index})" title="更改颜色"><i class="palette icon"></i></a>
</div>
<div class="content">
    ${r.passes.map((station, index)=>{
    return `<p><i class="ui blue circular label">${index+1}</i>
    <b>${station}</b></p>
    `
    }).join("")}
</div>`;
        $('#list_line').append(template);
    });
    
    //update route marker
    route.forEach(r=>{
        busPolyline = new AMap.Polyline({
            map: map,
            path: r.polyline,
            strokeColor: "#"+r.color,//线颜色
            strokeOpacity: 0.8,//线透明度
            strokeWeight: 3,//线宽
            lineJoin: 'round',
            isOutline:true,
            outlineColor:'#000000',
            lineCap:'round'
        });
    });

    //update interpolate point
    var last=null;
    route.forEach(r=>{
        if(last==null || r.polyline.length==0){
            last=r;
            return;
        }
        busPolyline = new AMap.Polyline({
            map: map,
            path: [last.polyline[last.polyline.length-1],r.polyline[0]],
            strokeColor: "#888888",//线颜色
            strokeOpacity: 0.8,//线透明度
            strokeWeight: 3,//线宽
            lineJoin: 'round',
            lineCap:'round',
            strokeStyle:'dashed'
        });
        last=r;
    })

    //update point markers
    route.forEach(r=>{
        if(r.polyline.length==0){
            return;
        }
        var c_start = new AMap.CircleMarker({
            center: r.polyline[0], //圆心
            radius: 4, //半径
            strokeColor: "BLUE", //轮廓线颜色
            strokeWeight: 2, //轮廓线宽度
            fillColor: "#ffffff", //圆点填充颜色
            fillOpacity: 1, //圆点填充透明度
        });
        var c_end = new AMap.CircleMarker({
            center: r.polyline[r.polyline.length-1], //圆心
            radius: 4, //半径
            strokeColor: "BLUE", //轮廓线颜色
            strokeWeight: 2, //轮廓线宽度
            fillColor: "#ffffff", //圆点填充颜色
            fillOpacity: 1, //圆点填充透明度
        });

        c_start.on('click',() => {$.toast({message:r.start_station})});
        c_end.on('click',() => {$.toast({message:r.end_station})});
        map.add(c_start);
        map.add(c_end);
    });

    map.setFitView();
}

function addRoute(){
    if(startStation==-1 || endStation==-1){
        $.toast({class:'error',message:'请输入始末站'});
        return;
    }

    var newRoute={};
    newRoute.start_station=lineData.via_stops[startStation].name;
    newRoute.end_station=lineData.via_stops[endStation].name;
    newRoute.via=lineData.name;
    newRoute.color=lineData.uicolor || "4488ff";
    newRoute.passes=[];
    newRoute.polyline=[];

    for(var i=startStation;i<=endStation;i++){
        newRoute.passes.push(lineData.via_stops[i].name);
    }

    var status=0;
    lineData.path.forEach(element => {

        if(status==0 && element.equals(lineData.via_stops[startStation].location)){
            status=1;
        }else if(status==1 && element.equals(lineData.via_stops[endStation].location)){
            newRoute.polyline.push(element);
            status=2;
        }

        if(status==1){
            newRoute.polyline.push(element);
        }
    });

    console.log(newRoute);
    addRoute2(newRoute);
    $('#line_modal').modal('hide');
}

function addRoute2(newRoute){
    route.push(newRoute);
    localStorage["brp_route"]=JSON.stringify(route);
    updateRoute();
}