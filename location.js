

/**
 * Search result of locations
 */
var locations;
function searchLocation(){
    const placeSearch = new AMap.PlaceSearch({
        city: $('#l_city').val(),
        pageSize: 50, //单页显示结果条数
        pageIndex: 1, //页码
    });
    placeSearch.search($('#l_keyword').val(),function(status,result){
        if(status!="complete"){
            $.toast({class:"error",message:"搜索失败："+status});
            return;
        }

        locations=result.poiList.pois;

        $('#l_result').html('');
        result.poiList.pois.forEach((poi,index) => {
            const template=`
            <button class="ui primary tertiary button" onclick="addLocation(${index})">${poi.id} ${poi.name} ${poi.address}</button> <br/>
            `
            $('#l_result').append(template);
        });
    }); 
}

function addLocation(index){
    const data=locations[index];
    addRoute2({
        start_station: data.name,
        end_station: data.name,
        via: "步行",
        color: "888888",
        passes: [],
        polyline: [data.location]
    });

    $('#add_location').modal('hide');
}