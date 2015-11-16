'use strict';


// init canvas
var width = window.innerWidth;
var height = window.innerHeight;
var center = { x: width / 2, y: height / 2 };
var canvas = document.body.appendChild(document.createElement('canvas'));
var ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;


// Point object
function Point(position, radius, color) {
    var self = this;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = color;
        ctx.fill()
    }
}

// create points
var points = [],
    frequency = 15,
    padding = 0;
for (var x = padding; x < width - (padding * 2); x = x + width / frequency) {
    for(var y = padding; y < height - (padding * 2); y = y + height / frequency) {
        points.push({
            x: x + Math.random() * (width - (padding * 2)) / frequency,
            y: y + Math.random() * (height - (padding * 2)) / frequency,
            originX: x + Math.random() * (width - (padding * 2)) / frequency,
            originY: y + Math.random() * (height - (padding * 2)) / frequency
        });
    }
}

// prep graphics for the points
for (var i in points) {
    var graphic = new Point(points[i], 5 + Math.random() * 3, 'rgba(150, 200, 220, 0.3)');
    points[i].graphic = graphic;
}

// find closest points to each point
for (var i in points) {
    var closest = [];
    var point1 = points[i];

    for (var j in points) {
        var point2 = points[j];

        if (point1 !== point2) {
            var placed = false;

            for (var k = 0; k < 5; k++) {
                if (! placed) {
                    if (closest[k] == undefined) {
                        closest[k] = point2;
                        placed = true;
                    }
                }
            }

            
            for (var k = 0; k < 5; k++) {
                if (! placed) {
                    if (getDistance(point1, point2) < getDistance(point1, closest[k])) {
                        closest[k] = point2;
                        placed = true;
                    }
                }
            }
        }
    }

    point1.closest = closest;
}

// every frame
function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = 'rgba(19, 45, 53, 1)';
    ctx.fill();

    for (var i in points) {
        shiftPoint(points[i]);
        drawLines(points[i]);
        points[i].graphic.draw();
    }

    requestAnimationFrame(animate);
}

function highlightPoint(point) {
    point.graphic = new Point(point, 12, 'rgba(255, 255, 255, 1)');
}

// render lines between points
function drawLines(point) {
    for(var i in point.closest) {
        var lineAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.closest[i].x, point.closest[i].y);
        ctx.strokeStyle = 'rgba(70, 160, 190, ' + lineAlpha + ')';
        ctx.stroke();
    }
}


// move the points around a little
function shiftPoint(point) {
    var coords = {
        x: point.originX - 400 + Math.random() * 800,
        y: point.originY - 400 + Math.random() * 800,
        ease: Circ.easeInOut
    };
    TweenLite.to(point, 1 + 1 * Math.random(), coords);
}

// get distance between two points
function getDistance(point1, point2) {
    return Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2);
}

// set it all running
function init() {
    animate();
    for(var i in points) {
        shiftPoint(points[i]);
    }
}

init();