import {default as V} from './Vector.js'

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const size = 800;
const segments = [];
const segmentLength = 1;


function map(x, in_min, in_max, out_min, out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
class Segment {
    constructor(x, y, len, i){
        this.a = V.createNew(x, y)
        this.aVel = V.createNew(0, 0);
        this.aAcc = V.createNew(0, 0);
        this.len = len;
        this.b = V.createNew(x+len, y);
        this.bVel = V.createNew(0, 0);
        this.bAcc = V.createNew(0, 0);
        this.angle = 0;
        this.index = i;
    }
    static createChild(parent, i){
        return new Segment(parent.b.x, parent.b.y, parent.len, i);
    }
    addAForceBro(force){
       this.aAcc.add(force); 
    }
    addBForceBro(force){
       this.bAcc.add(force); 
    }
    doPhysicsMaybe(){
        this.aVel.add(this.aAcc);
        this.bVel.add(this.bAcc);
        this.a.add(this.aVel);
        this.b.add(this.bVel);
        this.aAcc.mult(0);
        this.bAcc.mult(0);
    }
    follow(x, y){
        let target = V.createNew(x, y);
        let dir = target.clone().sub(this.a);
        this.angle = dir.getAngle();

        dir.normalize().mult(this.len);
        dir.mult(-1);

        this.addAForceBro(this.bVel.mult(-1));
        this.a = target.clone().add(dir);
        this.b = target;
    }
    draw(){
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.len; 
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.stroke();
    }
}

segments.push(new Segment(50, 50, segmentLength, 0));
for(let i = 1;i<size;i++){
    segments.push(Segment.createChild(segments[segments.length-1], i));
}

window.addEventListener('mousemove', (e) => {
    segments[0].follow(e.x, e.y);
})

const grav = V.createNew(0, .005);
let interval = setInterval(() => {

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    segments[0].draw();
    for(let i = 1;i<size;i++){
        segments[i].addAForceBro(grav);
        segments[i].addBForceBro(grav);
        segments[i].doPhysicsMaybe();
        let parent = segments[i-1];
        segments[i].follow(parent.a.x, parent.a.y);
        segments[i].draw();
    }

}, 10);

