import { default as V } from "./Vector.js";
import { Vertex, Vertices } from "./Segment.js";

const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snake = new Vertices(
  new Vertex(100, 100, {
    mass: 1,
    len: 10,
    width: 2,
  })
);
const size = 20;

for (let tmp = snake.head, i = 1; i < size; i++, tmp = tmp.makeRightSib());


// for(let tmp = snake.head; tmp !== null; tmp = tmp.sibRight){
//   console.log(tmp);
// }

snake.head.addForce(V.createNew(0, 1));
let interval = setInterval(() => {
  ctx.fillStyle = "#34568b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for(let tmp = snake.head; tmp !== null; tmp = tmp.sibRight){
    tmp.update();
  }

  snake.draw(ctx);
}, 10);
