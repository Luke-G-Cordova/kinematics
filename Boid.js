import {default as V} from "./Vector.js";

export default class Boid{
    constructor(x, y, options){
        this.position = V.createNew(x, y);
        this.velocity = V.createRandom(-1, 1);
        this.acceleration = V.createNew(0, 0);
        let ogo = {
            ctx: null,
            color: 'yellow',
            w: 10, 
            h: 20,
            eiboh: 270, 
            visibility: 100,
            image: null,
            maxSpeed: 5,
            minSpeed: 2
        }
        Object.assign(ogo, options);
        this.ctx = ogo.ctx;
        this.color = ogo.color;
        this.w = ogo.w;
        this.h = ogo.h;
        this.image = ogo.image;
        this.xPts = new Array(3);
        this.yPts = new Array(3);
        this.currentAngle = this.velocity.getAngle();
        this.eiboh = ogo.eiboh;
        this.eibohR = ogo.eiboh * Math.PI/180;
        this.visibility = ogo.visibility;
        this.maxSpeed = ogo.maxSpeed;
        this.minSpeed = ogo.minSpeed;
        this.#initCoords();
        this.setPts(this.currentAngle);
        return this;
    }
    move(){
        this.velocity.add(this.acceleration);
        this.velocity.upperLimit(this.maxSpeed);
        this.velocity.lowerLimit(this.minSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
    applyForce(vector){
        this.acceleration.add(vector);
    }
    drawLineTo(vector){
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(vector.x, vector.y);
        this.ctx.stroke();
    }
    canSee(vector){
        let oVec = vector.clone();
        let oPos = this.position.clone();
        oVec.sub(oPos);
        let tVecUp = this.velocity.clone().addAngle((this.eiboh/2) * Math.PI/180);
        let tVecDown = this.velocity.clone().addAngle(-(this.eiboh/2) * Math.PI/180);
        oVec.addAngle(-this.velocity.getAngle());
        let oVecAng = oVec.getAngle();
        return ((oVecAng >= 0 && oVecAng <= this.eibohR/2) || (oVecAng < 0 && oVecAng >= -this.eibohR/2)) && oVec.magnitude <= this.visibility;
    }
    rightOrLeft(vector){
        let oVec = vector.clone();
        let oPos = this.position.clone();
        oVec.sub(oPos);
        let oVecAng = oVec.getAngle();
        if(oVecAng<0){
            oVecAng += Math.PI*2;
        }
        let velAng = this.velocity.getAngle();
        if(velAng<0){
            velAng += Math.PI*2;
        }
        oVecAng -= velAng;
        if(oVecAng<0){
            oVecAng += Math.PI*2;
        }
        return {
            direction: oVec.magnitude > this.visibility ? 0 : oVecAng<=Math.PI ? -1 : 1, 
            distance: oVec.magnitude,
            direction2: oVecAng<=Math.PI ? -1 : 1
        };
    }
    drawVision(ctx){
        if(ctx)this.ctx = ctx;
        let ogStroke = this.ctx.strokeStyle;
        this.ctx.strokeStyle = 'rgba(255, 0, 0, .5)';
        // this.ctx.fillStyle = 'white';
        // this.ctx.font = '12px serif';
        // this.ctx.fillText(Math.round(this.velocity.getAngle() * 180/Math.PI), this.position.x+5, this.position.y);
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        
        this.ctx.arc(this.position.x, this.position.y, 
            this.visibility,
            -this.currentAngle, 
            -this.currentAngle-((this.eiboh/2)*(Math.PI/180)),
            true
        );
        this.ctx.lineTo(this.position.x, this.position.y);
        
        this.ctx.arc(this.position.x, this.position.y, 
            this.visibility, 
            -this.currentAngle,
            -this.currentAngle + ((this.eiboh/2)*(Math.PI/180)), 
            false
        );
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.strokeStyle = ogStroke;

    }
    drawVelocity(color = this.color){
        let posX = this.position.x;
        let posY = this.position.y;
        let velX = this.velocity.x;
        let velY = this.velocity.y;
        
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(posX, posY);
        this.ctx.lineTo(posX + velX, posY + velY);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.arc(posX + velX, posY + velY, 3, 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }
    draw(ctx){
        if(ctx)this.ctx = ctx;
        let posX = Math.round(this.position.x);
        let posY = Math.round(this.position.y);
        let ogColor = this.ctx.fillStyle;
        this.ctx.fillStyle = this.color;
        let angle = this.velocity.getAngle();
        this.setPts(angle - this.currentAngle);
        this.ctx.beginPath();
        this.ctx.moveTo(posX, posY);
        this.ctx.moveTo(this.xPts[0]+posX, this.yPts[0]+posY);
        this.ctx.lineTo(this.xPts[1]+posX, this.yPts[1]+posY);
        this.ctx.lineTo(this.xPts[2]+posX, this.yPts[2]+posY);
        this.ctx.lineTo(this.xPts[0]+posX, this.yPts[0]+posY);
        this.ctx.fill();
        this.ctx.fillStyle = ogColor;
    }
    drawImage(ctx){
        if(ctx)this.ctx = ctx;
        if(!!this.image){
            if(this.velocity.x<0){

                this.ctx.drawImage(this.image, this.position.x-20, this.position.y-20, 22, 40);
            }else{
                this.ctx.drawImage(this.image2, this.position.x-20, this.position.y-20, 22, 40);

            }
        }else{
            this.draw();
        }

    }

    setPts(angle = 0){
        let ogx, ogy;
        for(let i = 0;i<this.xPts.length;i++){
            ogx = this.xPts[i];
            ogy = this.yPts[i];
            let xPrime = (ogx * Math.cos(angle)) + (ogy * Math.sin(angle));
            let yPrime = (ogy * Math.cos(angle)) - (ogx * Math.sin(angle));
            this.xPts[i] = xPrime;
            this.yPts[i] = yPrime;
        }
        this.currentAngle = this.velocity.getAngle();
    }
    #initCoords(){
        this.xPts[0] = -(this.h/2);
		this.yPts[0] = +(this.w/2);

		this.xPts[1] = -(this.h/2);
		this.yPts[1] = -(this.w/2);

		this.xPts[2] = +(this.w/2);
		this.yPts[2] = 0;
    }
    getColor(){
        return this.color.split(/[rgba(),]/).filter((val) => val!=='').map(val => parseInt(val));
    }
    setColor(color){
        this.color = color;
    }
}