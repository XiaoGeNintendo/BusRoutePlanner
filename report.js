let y=30;

let totalDistance=0;

const X=350;

const X_RIGHT=700;

const ACCUMULATE_Y=50;
const CIRCLE_SIZE = 10;

let layer=new Konva.Layer();

function length(arr){
    return AMap.GeometryUtil.distanceOfLine(arr)
}

function generateReport(){
    layer=new Konva.Layer();
    y=30;
    totalDistance=0;

    // first we need to create a stage
    let stage = new Konva.Stage({
        container: 'report', // id of container <div>
        width: 800,
        height: 200
    });


    for(let i=0;i<route.length;i++){
        //add a route
        let r = route[i];

        let sameStation=false;

        //accumulate distance
        if(i!==0) {
            totalDistance += length([route[i-1].polyline[route[i-1].polyline.length-1], r.polyline[0]]);
        }

        //add dash line if not same station transfer
        if(i!==0 && r.start_station!==route[i-1].end_station) {
            let line = new Konva.Line({
                points: [X, y, X, y-ACCUMULATE_Y],
                stroke: 'grey',
                strokeWidth: 8,
                dash: [7, 7],
            });
            layer.add(line);
            line.moveToBottom();
        }else if(i!==0){
            sameStation=true;
        }

        //write distance
        let distanceText = new Konva.Text({
            x: X_RIGHT-150,
            y: y+(sameStation?-ACCUMULATE_Y+10:0),
            width: 150,
            text: `${(totalDistance/1000).toFixed(2)} km`,
            fontSize: 10,
            fill: 'grey',
            align: 'right'
        });
        layer.add(distanceText);

        if(r.passes.length===0){
            //it's a POI
            drawCircle(CIRCLE_SIZE,r.start_station);
        }else{
            //it's a route

            //add via text
            let viaText = new Konva.Text({
                x: 30,
                y: y - CIRCLE_SIZE - (sameStation?ACCUMULATE_Y:0),
                width: X - 60,
                text: r.via,
                fontSize: 20,
                fill: '#'+r.color,
                verticalAlign: 'middle',
                align: 'right'
            });

            layer.add(viaText);

            //draw a line first
            let line = new Konva.Line({
                points: [X,y-(sameStation?ACCUMULATE_Y:0),X,y+ACCUMULATE_Y*(r.passes.length-(sameStation?2:1))],
                stroke: "#"+r.color,
                strokeWidth: 8,
                lineCap: 'round',
                lineJoin: 'round'
            });

            layer.add(line);
            line.moveToBottom();

            //draw first circle
            if(!sameStation) {
                drawCircle(CIRCLE_SIZE, r.start_station);
            }

            for(let i=1; i<r.passes.length-1; i++){
                let pass = r.passes[i];
                drawCircle(CIRCLE_SIZE/2, pass.name);
            }
            drawCircle(CIRCLE_SIZE, r.end_station);

            //accumulate distance
            totalDistance+= length(r.polyline);
            let distanceText = new Konva.Text({
                x: X_RIGHT-150,
                y: y-ACCUMULATE_Y,
                width: 150,
                text: `${(totalDistance/1000).toFixed(2)} km`,
                fontSize: 10,
                fill: 'grey',
                align: 'right'
            });
            layer.add(distanceText);
        }
    }

    stage.add(layer);

    stage.height(y+100);
}

function bumpY(){
    y+=ACCUMULATE_Y;
}

function drawCircle(radius, text){
    //a circle
    let circle = new Konva.Circle({
        x: X,
        y: y,
        radius: radius,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1
    });

    //with text beside it
    let label = new Konva.Text({
        x: X+20,
        y: y-radius,
        text: text,
        fontSize: 20,
        fill: 'black',
        verticalAlign: 'middle'
    });

    layer.add(circle);
    layer.add(label);

    bumpY();
}