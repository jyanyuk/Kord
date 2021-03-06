var canvas = document.getElementById('canvas');
var paper = new Raphael(canvas, 800, 800);
var px;
var py;
var mousedown = false;
var path;
var path_string;
var cursors = {};
var selection;
var counter;
var width_select = 0;
var width_list = [5,10,15,20,25];
var stroke_color = 0
var stroke_list = ['blue','red','black','green','pink'];

var start = function () {
  this.odx = 0;
  this.ody = 0;
  //this.animate({"fill-opacity": 0.2}, 500);
},
move = function (dx, dy) {
  this.translate(dx - this.odx, dy - this.ody);
  this.odx = dx;
  this.ody = dy;
},
up = function () {
    //this.animate({"fill-opacity": 1}, 500);
};
////
// client
////

socket.on('connect',
    function(data) {
        print_data('connect', data);
        socket.emit('join_board', {
            boardid: boardid,
            userid: userid
        });
    }
);

$(canvas).mousedown(
    function(event) {
        mousedown = true;
        counter = 0;
        var x = (!event.offsetX) ? event.originalEvent.layerX : event.offsetX;
        var y = (!event.offsetY) ? event.originalEvent.layerY : event.offsetY;
        // paper.setStart();

        path_string = 'M' + x + ' ' + y + 'l0 0';
       
        
        path = paper.path(path_string).attr({
            'stroke-width' : width_list[width_select],
            'stroke'   : stroke_list[stroke_color]
        });

        path.dblclick(function(){
            this.remove();
        });


        px = (!event.offsetX) ? event.originalEvent.layerX : event.offsetX;
        py = (!event.offsetY) ? event.originalEvent.layerY : event.offsetY;
    }
);

$(canvas).mousemove(
    function(event) {
        if (!(counter % 10)) {
            if (mousedown) {
                var x = (!event.offsetX) ? event.originalEvent.layerX : event.offsetX;
                var y = (!event.offsetY) ? event.originalEvent.layerY : event.offsetY;
                path_string = path_string.concat('l' + (x - px) + ' ' + (y - py));
                path.attr('path', path_string);
                px = (!event.offsetX) ? event.originalEvent.layerX : event.offsetX;
                py = (!event.offsetY) ? event.originalEvent.layerY : event.offsetY;
            }
            socket.emit('mousemove',
                { userid : userid,
                roomid : roomid,
                boardid : boardid,
                cx : (!event.offsetX) ? event.originalEvent.layerX : event.offsetX,
                cy : (!event.offsetY) ? event.originalEvent.layerY : event.offsetY }
            );
        }
        counter++;
    }
);
$(document).mouseup(
    function(event) {
        if (mousedown) {
            // selection = paper.setFinish();
            // var json = JSON.stringify(path_string);
            socket.emit('draw',
                { boardid: boardid,
                roomid: roomid,
                userid: userid,
                path: path_string }
            );

            // need to set stroke width and color and any other useful details with it
        }
        mousedown = false;
    }
);

$(document).keydown(
    function(event){
        console.log('keydown');
        if(event.keyCode === 17){
            if(stroke_color === (stroke_list.length - 1)){ // up arrow =38  
                stroke_color = 0;
            }
            else if(event.keyCode === 17){
                stroke_color +=1;
            }
        }
    }
);
/*
$(document).keyup(function(e) {

  if (e.keyCode == 27) { <DO YOUR WORK HERE> }   // esc
});
*/

//toggle path width
$(document).keydown(
    function(event){
        console.log('keydown');
        if(event.keyCode == 40){
            if(width_select === (width_list.length - 1)){ // up arrow =38  
                width_select = 0;
            }
            else if(event.keyCode === 40){
                width_select +=1;
            }
        }
    }
);
// function emit() {
//     socket.emit('mousemove',
//         { userid : userid,
//         roomid : roomid,
//         boardid : boardid,
//         cx : px,
//         cy : py }
//     );
// }
// setInterval(emit, 20);


////
// server
////

socket.on('cursorupdate',
    function(data) {
        // print_data('cursorupdate', data);
        if(cursors[data.userid]) {
            cursors[data.userid].attr(
                { 'cx' : data.cx,
                  'cy' : data.cy }
            );
        }
        else {
            var f = Raphael.getColor();
            var s = Raphael.getColor();
            var circle = paper.circle(data.cx, data.cy, 10).attr(
                { 'fill' : f,
                'stroke' : s,
                'stroke-width' : 5 }
            );
            cursors[data.userid] = circle;
        }
    }
);

socket.on('add',
    function(data) {
        print_data('add', data);

        paper.path(data.path);
    }
);

socket.on('move',
    function(data) {

    }
);

socket.on('remove',
    function(data) {

    }
);

socket.on('hover',
    function(data) {

    }
);

socket.on('double click',
    function(data) {
        //delete element at current point

    }
);

socket.on('transform',
    function(data) {

    }
);

function print_data(message, data) {
    console.log(message + '>');
    for (var prop in data) {
        console.log(prop + ': ' + data[prop]);
    }
}
