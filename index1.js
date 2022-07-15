import { default as V } from "./Vector.js";
import { map, Segment } from "./Segment.js";
import BoidSimulation from "./BoidSimulation.js";
import Boid from "./Boid.js";

const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// initialize variables
const size = 1000;
const segmentLength = 1;

let mouseX = 50;
let mouseY = 50;

let boids = [];
for (let i = 0; i < 10; i++) {
  let color = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
    color = color.map((val, i, arr) => {
        let less = 0;
        for(let j = 0 ;j<arr.length;j++){
            if(j===i)continue;
            if(val < arr[j]){
                less++;
            }else if(val > arr[j]){
                less--;
            }
        }
        return less < 0 ? 0 : less > 0 ? 255 : val ;
    });
  let width = Math.random() * ctx.canvas.width;
  let height = Math.random() * ctx.canvas.height;
  boids.push(
    new Boid(width, height, {
      ctx: ctx,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`,
      w: 10,
      h: 20,
    })
  );
  boids[i].velocity.add(
    V.createNew(Math.random() * 2 - 1, Math.random() * 2 - 1)
      .normalize()
      .mult(1)
  );
  boids[i].add = 1;

  let tail = [];
  tail.push(
    new Segment(boids[i].position.x, boids[i].position.y, segmentLength, {
      width: map(i, 0, size, 6, 0),
      mass: .0005
    })
  );
  for (let j = 1; j < size; j++) {
    tail.push(Segment.createChild(tail[tail.length - 1], {
      width: map(j, 0, size, 6, 0),
      mass: map(j, 1, size, .005, .00001)
    }));
  }
  boids[i].tail = tail;
}

let bs = new BoidSimulation({
  flock: boids,
  seperationOffset: .1
});


let bInterval = setInterval(() => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  bs.loop((boid, boidArray) => {
    walls(boid);

    for (let i = 0; i < size; i++) {
      if (i === 0) {
        boid.tail[0].follow(boid.position.x, boid.position.y);
      } else {
        var parent = boid.tail[i - 1];
        boid.tail[i].follow(parent.a.x, parent.a.y);
      }
      ctx.strokeStyle = boid.color;
      boid.tail[i].draw(ctx);
    }
  });
});


// mouse input
window.addEventListener("mousemove", (e) => {
  mouseX = e.x;
  mouseY = e.y;
});

function walls(boid) {
  let offset = 100
  if (boid.position.x < offset) {
    boid.applyForce(V.createNew(map(boid.position.x, offset, 0, 0, 1), 0));
  } else if (boid.position.x > ctx.canvas.width - offset) {
    boid.applyForce(V.createNew(map(canvas.width - boid.position.x, 0, offset, -1, 0), 0));
  }
  if (boid.position.y < offset) {
    boid.applyForce(V.createNew(0, map(boid.position.y, offset, 0, 0, 1)));
  } else if (boid.position.y > ctx.canvas.height - offset) {
    boid.applyForce(V.createNew(0, map(canvas.height - boid.position.y, 0, offset, -1, 0)));
  }
}
