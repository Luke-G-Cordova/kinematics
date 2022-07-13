export default class Vector {
    constructor(obj){
        this.x = obj.x;
        this.y = obj.y;
        this.#calculateMagnitude();
    }
    static createNew(x, y){
        return new Vector({x: x, y: y});
    }
    static createRandom(){
        return new Vector({x: Math.random(), y: Math.random()});
    }
    static createRandom(rangeMin, rangeMax){
        let times = rangeMax - rangeMin;
        return new Vector({x: (Math.random() * times) + rangeMin, y: (Math.random() * times) + rangeMin});
    }
    add(vector){
        this.x += vector.x;
        this.y += vector.y;
        this.#calculateMagnitude();
        return this;
    }
    addAngle(radians){
        let p1 = this.x * Math.cos(radians);
        let p2 = this.y * Math.sin(radians);
        let p3 = this.y * Math.cos(radians);
        let p4 = this.x * Math.sin(radians);
        this.x = (p1 + p2);
        this.y = (p3 - p4);
        let mag = this.magnitude;
        this.normalize();
        this.mult(mag);
        return this;
    }
    getAngle(){
        return Math.atan2(-this.y, this.x);
    }
    sub(vector){
        this.x -= vector.x;
        this.y -= vector.y;
        this.#calculateMagnitude();
        return this;
    }
    mult(scalor){
        this.x *= scalor;
        this.y *= scalor;
        this.#calculateMagnitude();
        return this;
    }
    div(scalor){
        this.x /= scalor;
        this.y /= scalor;
        this.#calculateMagnitude();
        return this;
    }
    upperLimit(scalor){
        let f = Math.min(this.magnitude, scalor) / this.magnitude;
        this.x = f * this.x;
        this.y = f * this.y;
        this.#calculateMagnitude();
        return this;
    }
    lowerLimit(scalor){
        let f = Math.max(this.magnitude, scalor) / this.magnitude;
        this.x = f * this.x;
        this.y = f * this.y;
        this.#calculateMagnitude();
        return this;
    }
    normalize(){
        this.#calculateMagnitude();
        if(this.magnitude !== 0){
            this.x /= this.magnitude;
            this.y /= this.magnitude;
            this.#calculateMagnitude();
        }
        return this;
    }
    #calculateMagnitude(){
        this.magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    clone(){
        return Vector.createNew(this.x, this.y);
    }
}