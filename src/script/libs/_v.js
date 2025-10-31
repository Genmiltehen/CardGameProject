import { clamp } from "./utils.js";

export class _v {
	static PI2 = Math.PI * 2;
	static radToDeg = 180 / Math.PI;
	static degToRad = Math.PI / 180;

	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {_v}
	 */
	constructor(x, y) {
		this.x = x !== undefined ? x : 0;
		this.y = y !== undefined ? y : 0;
	}

	static Distance(p1, p2) {
		var dx = p2.x - p1.x,
			dy = p2.y - p1.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	static Angle(P1, P2, wrap) {
		var deltaY = P2.y - P1.y,
			deltaX = P2.x - P1.x;
		var ret = Math.atan2(deltaY, deltaX);
		if (wrap) {
			while (ret < 0) ret += PI2;
		}
		return ret;
	}

	/**
	 * @param {number} radian
	 */
	static fromRadians(radian) {
		var x = Math.cos(radian);
		var y = Math.sin(radian);
		return new _v(x, y);
	}

	/**
	 * @param {number} degree
	 */
	static fromDegrees(degree) {
		var rad = degree * (Math.PI / 180.0);
		return _v.fromRadians(rad);
	}

	static fromString(str) {
		var parts = str.split(" ");
		return new _v(parseFloat(parts[0]), parseFloat(parts[1]));
	}

	static fromArray(arr) {
		return new _v(arr[0], arr[1]);
	}

	/**
	 *
	 * @param {_v} _v1
	 * @param {_v} _v2
	 * @param {Number} val
	 * @param {Boolean} clamp_
	 * @returns
	 */
	static lerp(_v1, _v2, val, clamp_ = true) {
		if (clamp_) val = clamp(val, 0, 1);
		return _v1.mulScalar(1 - val).add(_v2.mulScalar(val));
	}

	clone() {
		return new _v(this.x, this.y);
	}

	equals(_v) {
		return this.prototype === _v.prototype && this.x === _v.x && this.y === _v.y;
	}

	copy(_v) {
		this.x = _v.x;
		this.y = _v.y;
		return this;
	}

	copyX(_v) {
		this.x = _v.x;
		return this;
	}

	copyY(_v) {
		this.y = _v.y;
		return this;
	}

	toDict() {
		return { x: this.x, y: this.y };
	}

	toArray() {
		return [this.x, this.y];
	}

	set(x, y) {
		if (x !== undefined) this.x = x;
		if (y !== undefined) this.y = y;
		return this;
	}

	flipXY() {
		return new _v(this.y, this.x);
	}

	flipXYSelf() {
		this.y = [this.x, (this.x = this.y)][0];
		return this;
	}

	invert() {
		return this.mulScalar(-1);
	}

	invertSelf() {
		this.mulScalarSelf(-1);
		return this;
	}

	distanceFrom(other) {
		return _vsDistance(this, other);
	}

	radiansTo(other) {
		return _vsAngle(this, other, true);
	}

	degreesTo(other) {
		return _vsAngle(this, other, true) * radToDeg;
	}

	toRadians(other) {
		return _vsAngle(_v.zero, this, true);
	}

	toDegrees(other) {
		return this.toRadians() * radToDeg;
	}

	rotateDegreesSelf(degrees) {
		return this.rotateRadiansSelf(degrees * degToRad);
	}

	rotateDegrees(degrees) {
		return this.clone().rotateDegreesSelf(degrees);
	}

	rotateRadiansSelf(radians) {
		var ca = Math.cos(radians);
		var sa = Math.sin(radians);
		var x = this.x * ca - this.y * sa;
		var y = this.x * sa + this.y * ca;
		this.x = smartRound(x);
		this.y = smartRound(y);
		return this;
	}

	rotateRadians(radians) {
		return this.clone().rotateRadiansSelf(radians);
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalizeSelf() {
		var by = Math.sqrt(this.x * this.x + this.y * this.y);
		if (by === 0) return this;
		this.x /= by;
		this.y /= by;
		return this;
	}

	normalize() {
		return this.clone().normalizeSelf();
	}

	addSelf(other) {
		if (typeof other === "number") {
			return this.addScalarSelf(other);
		}

		this.x += other.x;
		this.y += other.y;
		return this;
	}

	subSelf(other) {
		if (typeof other === "number") {
			return this.subScalarSelf(other);
		}

		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	divSelf(other) {
		if (typeof other === "number") {
			return this.divScalarSelf(other);
		}

		this.x /= other.x;
		this.y /= other.y;
		return this;
	}

	/**
	 * @param {Number | _v} other
	 * @returns
	 */
	mulSelf(other) {
		if (typeof other === "number") {
			return this.mulScalarSelf(other);
		}

		this.x *= other.x;
		this.y *= other.y;
		return this;
	}

	addScalarSelf(val) {
		this.x += val;
		this.y += val;
		return this;
	}

	subScalarSelf(val) {
		this.x -= val;
		this.y -= val;
		return this;
	}

	divScalarSelf(val) {
		this.x /= val;
		this.y /= val;
		return this;
	}

	mulScalarSelf(val) {
		this.x *= val;
		this.y *= val;
		return this;
	}

	add(other) {
		return this.clone().addSelf(other);
	}

	sub(other) {
		return this.clone().subSelf(other);
	}

	mul(other) {
		return this.clone().mulSelf(other);
	}

	div(other) {
		return this.clone().divSelf(other);
	}

	addScalar(scalar) {
		return this.clone().addScalarSelf(scalar);
	}

	subScalar(scalar) {
		return this.clone().subScalarSelf(scalar);
	}

	/**
	 * @param {Number} scalar
	 * @returns {_v}
	 */
	mulScalar(scalar) {
		return this.clone().mulScalarSelf(scalar);
	}

	divScalar(scalar) {
		return this.clone().divScalarSelf(scalar);
	}

	clampSelf(min, max) {
		if (this.x < min.x) this.x = min.x;
		if (this.y < min.y) this.y = min.y;
		if (this.x > max.x) this.x = max.x;
		if (this.y > max.y) this.y = max.y;
		return this;
	}

	clamp(min, max) {
		return this.clone().clampSelf(min, max);
	}

	applySelf(func) {
		this.x = func(this.x);
		this.y = func(this.y);
		return this;
	}

	apply(func) {
		return this.clone().applySelf(func);
	}

	absSelf() {
		return this.applySelf(Math.abs);
	}

	abs() {
		return this.clone().absSelf();
	}

	roundSelf() {
		return this.applySelf(Math.round);
	}

	round() {
		return this.clone().roundSelf();
	}

	dot(other) {
		return this.x * other.x + this.y * other.y;
	}

	cross(other) {
		return this.x * other.y - this.y * other.x;
	}

	repairSelf(x, y) {
		if (typeof this.x !== "number" || isNaN(this.x + 1)) {
			this.x = x || 0;
		}
		if (typeof this.y !== "number" || isNaN(this.y + 1)) {
			this.y = y || 0;
		}
		return this;
	}

	repair(x, y) {
		return this.clone().repairSelf(x, y);
	}

	toString() {
		return `[${this.x} ${this.y}]`;
	}

	format(format) {
		format = format || "%x,%y";
		format = format.replace(new RegExp("%x", "g"), this.x);
		format = format.replace(new RegExp("%y", "g"), this.y);
		return format;
	}
}
