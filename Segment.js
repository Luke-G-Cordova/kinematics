import { default as V } from "./Vector.js";

export function map(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export class Segment {
  constructor(x, y, len, options) {
    let ogo = {
      width: 1,
      mass: 1,
      startDir: V.createNew(1, 0)
    };
    ogo = Object.assign(ogo, options);
    // this.a = V.createNew(x, y)
    this.startDir = ogo.startDir;
    this.a = V.createNew(x, y).add(ogo.startDir.mult(len));
    this.oldA = this.a;
    this.aVel = V.createNew(0, 0);

    this.aAcc = V.createNew(0, 0);
    this.len = len;
    this.b = V.createNew(x, y);
    // this.b = V.createNew(x+len, y);
    this.oldB = this.b;
    this.bVel = V.createNew(0, 0);
    this.bAcc = V.createNew(0, 0);
    this.angle = 0;
    this.width = ogo.width;
    this.mass = ogo.mass;
  }
  static createChild(parent, options) {
    let ogo = {
      len: parent.len,
      width: parent.width,
      mass: parent.mass,
      startDir: parent.startDir
    };
    ogo = Object.assign(ogo, options);
    return new Segment(parent.a.x, parent.a.y, ogo.len, ogo);
  }
  addAForceBro(force) {
    this.aAcc.add(force).mult(this.mass);
  }
  addBForceBro(force) {
    this.bAcc.add(force).mult(this.mass);
  }
  doPhysicsMaybe() {
    this.aVel.add(this.aAcc);
    this.bVel.add(this.bAcc);
    this.a.add(this.aVel);
    this.b.add(this.bVel);
    this.aAcc.mult(0);
    this.bAcc.mult(0);
  }
  follow(x, y) {
    this.addAForceBro(this.a.clone().sub(this.oldA));
    // this.addBForceBro(this.b.clone().sub(this.oldB));
    this.doPhysicsMaybe();

    let target = V.createNew(x, y);
    let dir = target.clone().sub(this.a);
    this.angle = dir.getAngle();

    dir.normalize().mult(this.len);
    dir.mult(-1);
    this.oldA = this.a;
    this.oldB = this.b;
    this.a = target.clone().add(dir);
    this.b = target;
  }
  draw(ctx) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}
