let stage=null;
let layerLine=null;
let groupLine=null;

let layerWalk=null;

let walkText=null;
let walkArrow = null;

var LCD_SPACING = 180;
var LCD_TWO_SIDE = false;
var ANIMATION_TIME = 0.5;

//on document ready
document.addEventListener('DOMContentLoaded', function() {

    // first we need to create a stage
    stage = new Konva.Stage({
        container: 'lcd', // id of container <div>
        width: $('#lcd').width(),
        height: 200
    });

    // then create layer
    layerLine = new Konva.Layer();
    layerWalk = new Konva.Layer();

    // create walk stuff
    walkArrow = new Konva.Arrow({
        x: 0,
        y: stage.height() / 2,
        points: [0, 0, 100, 0],
        pointerLength: 10,
        pointerWidth: 20,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 40
    });

    walkText = new Konva.Text({
        text: 'LCD加载中……',
        fontSize: 24,
        verticalAlign:'middle'
    });

    groupLine = new Konva.Group({

    });

    layerWalk.add(walkArrow)
    layerWalk.add(walkText);
    layerWalk.add(groupLine);

    stage.add(layerLine);
    stage.add(layerWalk);

    // by default hides the lcd
    $('#lcd').hide();


});

function showLcd(){
    $('#lcd').show();
}

//if stationName=="" it is a same-station transfer
function showLcdWithMove(stationName){
    if(stationName==="") {
        walkText.text('同站换乘');
    }else{
        walkText.text('前往 ' + stationName);
    }

    walkArrow.x(-500);
    walkText.x(stage.width());
    walkText.y(stage.height()/2);

    walkText.to({
        x: stage.width()/3,
        duration: 0.5,
        easing: Konva.Easings.StrongEaseInOut,
    })
    walkArrow.to({
        x: 20,
        duration: 0.5,
        easing: Konva.Easings.StrongEaseInOut,
    })

    groupLine.to({
        opacity: 0,
        duration: 0.5,
    })
    layerLine.to({
        opacity: 0,
        duration: 0.5
    })
}

function calcX(index){
    return 30+LCD_SPACING*index;
}

function showLcdWithLine(line){

    const isPOI = line.passes.length===0;

    groupLine.destroyChildren();
    layerLine.destroyChildren();

    groupLine.x(0);

    //draw a line under the circles
    if(!isPOI) {
        const linePath = new Konva.Line({
            points: [calcX(0), stage.height() / 2, calcX(line.passes.length - 1), stage.height() / 2],
            stroke: '#' + line.color,
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
        });
        groupLine.add(linePath);
    }

    //add station circles
    for(let i=0;i<line.passes.length;i++){
        const circle = new Konva.Circle({
            x: calcX(i),
            y: stage.height()/2,
            radius: 10,
            fill: 'white',
            stroke: 'red',
            id: 'c'+i,
            strokeWidth: 1
        });

        groupLine.add(circle);
    }

    // add station names
    for(let i=0;i<line.passes.length;i++){
        const obj=line.passes[i];

        const text = new Konva.Text({
            x: calcX(i),
            y: stage.height()/2 + (LCD_TWO_SIDE ? (i%2 ? -25 : 15) : 15),
            verticalAlign: 'center',
            text: obj.name,
            fontSize: 14,
            align: 'center',
        });

        groupLine.add(text)
    }

    //add line name
    if(!isPOI) {
        const lineName = new Konva.Text({
            x: 15,
            y: 15,
            text: line.via,
            fontSize: 24,
            align: 'left',
            fill: '#' + line.color
        });

        layerLine.add(lineName);
    }

    // add arrow
    for(let i=1;i<=3;i++){
        const ar = new Konva.Line({
            x: calcX(0.1*i),
            y: 40,
            points: [0,0,30/5,0,50/5,50/5,30/5,100/5,0,100/5,20/5,50/5],
            fill: '#00D2FF',
            stroke: 'black',
            strokeWidth: 1,
            closed: true
        });

        const anim = new Konva.Animation(function(frame) {
            const INTER=600
            ar.opacity(Math.abs((frame.time-i*INTER/6)%INTER-INTER/2)/INTER*2);
        }, layerLine);
        anim.start();

        layerLine.add(ar);
    }

    // add transition
    groupLine.to({
        opacity: 1,
        duration: 0.5,
    })
    layerLine.to({
        opacity: 1,
        duration: 0.5
    })
    walkArrow.to({
        x: -500,
        duration: 0.5,
        easing: Konva.Easings.StrongEaseInOut,
    })

    walkText.to({
        x: stage.width(),
        duration: 0.5,
        easing: Konva.Easings.StrongEaseInOut,
    })

    setTimeout(function(){passLcd(0)},500);
}

function passLcd(index){
    groupLine.to({
        x: -calcX(index-0.5),
        duration: ANIMATION_TIME,
        easing: Konva.Easings.StrongEaseInOut,
    })

    groupLine.findOne('#c'+index)?.stroke('gray');
    groupLine.findOne('#c'+(index+1))?.stroke('green');
}