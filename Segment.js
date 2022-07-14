import { default as V } from "./Vector.js";

export function map(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export class Vertices {
  constructor(head) {
    this.head = head;
  }
  draw(ctx) {
    let tmp = this.head;
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.head.width;
    ctx.beginPath();
    ctx.moveTo(this.head.pos.x, this.head.pos.y);
    tmp = tmp.sibRight;
    while (tmp !== null) {
      ctx.lineTo(tmp.pos.x, tmp.pos.y);
      tmp = tmp.sibRight;
    }
    ctx.stroke();
  }
}

export class Vertex {
  constructor(x, y, options) {
    let ogo = {
      sibLeft: null,
      sibRight: null,
      mass: 1,
      len: 1,
      width: 1,
    };
    ogo = Object.assign(ogo, options);

    this.pos = V.createNew(x, y);
    this.oldPos = this.pos;
    this.sibLeft = ogo.sibLeft;
    this.sibRight = ogo.sibRight;
    this.mass = ogo.mass;
    this.len = ogo.len;
    this.width = ogo.width;
    this.vel = V.createNew(0, 0);
    this.acc = V.createNew(0, 0);
    this.angleLeft = 0;
    this.angleRight = 0;
  }
  makeRightSib(options) {
    let ogo = {
      mass: this.mass,
      width: this.width,
    };
    ogo = Object.assign(ogo, options);

    let nv = new Vertex(this.pos.x + this.len, this.pos.y, {
      sibLeft: this,
      sibRight: null,
      mass: ogo.mass,
      len: this.len,
      width: ogo.width,
    });

    this.sibRight = nv;

    return nv;
  }
  addForce(force) {
    this.acc.add(force).mult(this.mass);
  }
  doPhysics() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  update() {
    // if (this.sibLeft) {
    //   this.addForce(this.sibLeft.pos.clone().sub(this.sibLeft.oldPos));
    // }
    // if (this.sibRight) {
    //   this.addForce(this.sibRight.pos.clone().sub(this.sibRight.oldPos));
    // }
    this.addForce(this.pos.clone().sub(this.oldPos));
    this.doPhysics();

    this.oldPos = this.pos;

    let ang, dir, adjac, adjacMag;
    if (this.sibLeft !== null && this.sibRight !== null) {
      adjac = this.sibLeft.pos.clone().sub(this.sibRight.pos);
      adjacMag = adjac.magnitude / 2;
      ang = Math.acos(adjacMag / this.len);

      // test for NaN because NaN is the only value not equal to itself
      ang = ang != ang ? adjac.getAngle() : ang + adjac.getAngle();

      dir = V.createNew(1, 0)
        .addAngle(ang + Math.PI)
        .normalize()
        .mult(this.len);
      this.pos = this.sibLeft.pos.clone().add(dir);
    } else if (this.sibLeft !== null && this.sibRight === null) {
      dir = this.sibLeft.pos.clone().sub(this.pos);
      dir.normalize().mult(this.len);
      this.pos = this.sibLeft.pos.clone().add(dir);
    } else if (this.sibRight !== null && this.sibLeft === null) {
      dir = this.sibRight.pos.clone().sub(this.pos);
      dir.normalize().mult(this.len);
      this.pos = this.sibRight.pos.clone().add(dir);
    }
  }
}

export class Segment {
  constructor(x, y, len, options) {
    let ogo = {
      width: 1,
      mass: 1,
    };
    ogo = Object.assign(ogo, options);
    // this.a = V.createNew(x, y)
    this.a = V.createNew(x + len, y);
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
