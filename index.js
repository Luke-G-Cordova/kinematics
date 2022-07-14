import { default as V } from "./Vector.js";
import { map, Segment } from "./Segment.js";

const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// initialize variables
const size = 2;
const segments = [];
const segmentLength = 100;
const startingPos = V.createNew(canvas.width / 2, canvas.height / 8);

const grav = V.createNew(0, .7);
let mouseX = 50;
let mouseY = 50;

// create segments
segments.push(new Segment(startingPos.x, startingPos.y, segmentLength, {mass: 2/5}));
for (let i = 1; i < size; i++) {
  segments.push(Segment.createChild(segments[segments.length - 1]));
}



// segments[0].addAForceBro(grav);
// segments[0].addBForceBro(grav);
// loop
let interval = setInterval(() => {
  // clear on every loop
  ctx.fillStyle = "#34568b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < size; i++) {

    // gravity
    segments[i].addAForceBro(grav);
    segments[i].addBForceBro(grav);

    if (i === 0) {
      // segments[0].follow(mouseX, mouseY); 
      segments[0].follow(segments[0].b.x, segments[0].b.y);
    } else {
      var parent = segments[i - 1];
      segments[i].follow(parent.a.x, parent.a.y);
    }

    segments[i].draw(ctx);

  }
}, 10);

// mouse input
window.addEventListener("mousemove", (e) => {
  mouseX = e.x;
  mouseY = e.y;
});
