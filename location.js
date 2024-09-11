function showAddLocationModal(){
    $('#add_location').modal('show');
}

function searchLocation(){
    const placeSearch = new AMap.PlaceSearch({
        city: $('#l_city').val(),
        pageSize: 5, //单页显示结果条数
        pageIndex: 1, //页码
        map:map,
        panel: "l_result", //参数值为你页面定义容器的 id 值<div id="my-panel"></div>，结果列表将在此容器中进行展示。
        autoFitView: true, //是否自动调整地图视野使绘制的 Marker 点都处于视口的可见范围
    });
    placeSearch.search($('#l_keyword').val()); //使用插件搜索关键字并查看结果
    placeSearch.on("listElementClick",e =>{
        console.log(e);

    })
}