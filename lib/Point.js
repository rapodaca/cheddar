/**
 * Cheddar - Bitcoin wallet library for JavaScript
 *
 * Copyright (c) 2014 Richard L. Apodaca
 * All Rights Reserved.
 *
 * Copyright (c) 2005 Tom Wu
 * All Rights Reserved.
 *
 * Copyright (c) 2013 Kyle Drake
 * All Rights Reserved.
 *
 * Licensed under the MIT License
 * See "LICENSE" for details.
 *
 * @file Basic JavaScript BN library - subset useful for RSA encryption.
 * @author Tom Wu <tjw@cs.stanford.edu>
 * @author Richard L. Apodaca <rich.apodaca@gmail.com>
 * @author Kyle Drake
 */

var BigInteger = require('./BigInteger');

/**
 * @constructor
 * @param {Curve} curve
 * @param {BigInteger} x
 * @param {BigInteger} y
 * @param {BigInteger} z
 */
var Point = function(curve, x, y, z) {
  this.curve = curve;
  this.x = x;
  this.y = y;
  // Projective coordinates: either zinv == null or z * zinv == 1
  // z and zinv are just BigIntegers, not fieldElements
  if(z == null) {
    this.z = BigInteger.ONE;
  } else {
    this.z = z;
  }
  
  this.zinv = null;
  //TODO: compression flag
};

/**
 * @return {FieldElement}
 */
Point.prototype.getX = function() {
  if(this.zinv == null) {
    this.zinv = this.z.modInverse(this.curve.q);
  }

  return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
};

/**
 * @return {FieldElement}
 */
Point.prototype.getY = function() {
  if(this.zinv == null) {
    this.zinv = this.z.modInverse(this.curve.q);
  }

  return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
};

/**
 * @param {Point} other
 * @return {boolean}
 */
Point.prototype.equals = function(other) {
  if (other == this) {
    return true;
  }

  if (this.isInfinity()) {
    return other.isInfinity();
  }

  if (other.isInfinity()) {
    return this.isInfinity();
  }

  // u = Y2 * Z1 - Y1 * Z2
  var u = other.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(other.z)).mod(this.curve.q);

  if (!u.equals(BigInteger.ZERO)) {
    return false;
  }

  // v = X2 * Z1 - X1 * Z2
  var v = other.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(other.z)).mod(this.curve.q);

  return v.equals(BigInteger.ZERO);
};

/**
 * @return {boolean}
 */
Point.prototype.isInfinity = function() {
  if ((this.x == null) && (this.y == null)) {
    return true;
  }

  return this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
};

/**
 * @return {Point}
 */
Point.prototype.negate = function pointFpNegate() {
  return new Point(this.curve, this.x, this.y.negate(), this.z);
};

/**
 * @param {Point} b
 * @return {Point}
 */
Point.prototype.add = function(b) {
  if (this.isInfinity()) {
    return b;
  }

  if (b.isInfinity()) {
    return this;
  }

  // u = Y2 * Z1 - Y1 * Z2
  var u = b.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(b.z)).mod(this.curve.q);
  // v = X2 * Z1 - X1 * Z2
  var v = b.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(b.z)).mod(this.curve.q);

  if (BigInteger.ZERO.equals(v)) {
    if(BigInteger.ZERO.equals(u)) {
        return this.twice(); // this == b, so double
    }

    return this.curve.getInfinity(); // this = -b, so infinity
  }

  var x1 = this.x.toBigInteger();
  var y1 = this.y.toBigInteger();
  var x2 = b.x.toBigInteger();
  var y2 = b.y.toBigInteger();

  var v2 = v.square();
  var v3 = v2.multiply(v);
  var x1v2 = x1.multiply(v2);
  var zu2 = u.square().multiply(this.z);

  // x3 = v * (z2 * (z1 * u^2 - 2 * x1 * v^2) - v^3)
  var x3 = zu2.subtract(x1v2.shiftLeft(1)).multiply(b.z).subtract(v3).multiply(v).mod(this.curve.q);
  // y3 = z2 * (3 * x1 * u * v^2 - y1 * v^3 - z1 * u^3) + u * v^3
  var y3 = x1v2.multiply(new BigInteger("3")).multiply(u).subtract(y1.multiply(v3)).subtract(zu2.multiply(u)).multiply(b.z).add(u.multiply(v3)).mod(this.curve.q);
  // z3 = v^3 * z1 * z2
  var z3 = v3.multiply(this.z).multiply(b.z).mod(this.curve.q);

  return new Point(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
};

/**
 * @return {Point}
 */
Point.prototype.twice = function() {
  if (this.isInfinity()) {
    return this;
  }

  if (this.y.toBigInteger().signum() == 0) {
    return this.curve.getInfinity();
  }

  // TODO: optimized handling of constants
  var THREE = new BigInteger("3");
  var x1 = this.x.toBigInteger();
  var y1 = this.y.toBigInteger();

  var y1z1 = y1.multiply(this.z);
  var y1sqz1 = y1z1.multiply(y1).mod(this.curve.q);
  var a = this.curve.a.toBigInteger();

  // w = 3 * x1^2 + a * z1^2
  var w = x1.square().multiply(THREE);

  if (!BigInteger.ZERO.equals(a)) {
    w = w.add(this.z.square().multiply(a));
  }

  w = w.mod(this.curve.q);
  // x3 = 2 * y1 * z1 * (w^2 - 8 * x1 * y1^2 * z1)
  var x3 = w.square().subtract(x1.shiftLeft(3).multiply(y1sqz1)).shiftLeft(1).multiply(y1z1).mod(this.curve.q);
  // y3 = 4 * y1^2 * z1 * (3 * w * x1 - 2 * y1^2 * z1) - w^3
  var y3 = w.multiply(THREE).multiply(x1).subtract(y1sqz1.shiftLeft(1)).shiftLeft(2).multiply(y1sqz1).subtract(w.square().multiply(w)).mod(this.curve.q);
  // z3 = 8 * (y1 * z1)^3
  var z3 = y1z1.square().multiply(y1z1).shiftLeft(3).mod(this.curve.q);

  return new Point(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
};

/**
 * Simple NAF (Non-Adjacent Form) multiplication algorithm
 * TODO: modularize the multiplication algorithm
 *
 * @param {Point} k
 * @return {Point}
 */
Point.prototype.multiply = function(k) {
  if (this.isInfinity()) {
    return this;
  }

  if (k.signum() == 0) {
    return this.curve.getInfinity();
  }

  var e = k;
  var h = e.multiply(new BigInteger("3"));

  var neg = this.negate();
  var R = this;

  var i;
  
  for (i = h.bitLength() - 2; i > 0; --i) {
    R = R.twice();

    var hBit = h.testBit(i);
    var eBit = e.testBit(i);

    if (hBit != eBit) {
      R = R.add(hBit ? this : neg);
    }
  }

  return R;
}

/**
 * Compute this*j + x*k (simultaneous multiplication)
 *
 * @parmam {Point} j
 * @param {ECPpointFp} x
 * @param {Point} k
 * @return {Point}
 */
Point.prototype.multiplyTwo = function(j, x, k) {
  var i;

  if (j.bitLength() > k.bitLength()) {
    i = j.bitLength() - 1;
  } else {
    i = k.bitLength() - 1;
  }

  var R = this.curve.getInfinity();
  var both = this.add(x);

  while (i >= 0) {
    R = R.twice();

    if (j.testBit(i)) {
      if (k.testBit(i)) {
        R = R.add(both);
      }
      else {
        R = R.add(this);
      }
    }
    else {
      if(k.testBit(i)) {
        R = R.add(x);
      }
    }
    --i;
  }

  return R;
};

/**
 * @param {boolean} compressed
 * @return {number[]}
 */
Point.prototype.getEncoded = function (compressed) {
  var x = this.getX().toBigInteger();
  var y = this.getY().toBigInteger();

  // Get value as a 32-byte Buffer
  // Fixed length based on a patch by bitaddress.org and Casascius
  var enc = integerToBytes(x, 32);

  if (compressed) {
    if (y.isEven()) {
      // Compressed even pubkey
      // M = 02 || X
      enc.unshift(0x02);
    } else {
      // Compressed uneven pubkey
      // M = 03 || X
      enc.unshift(0x03);
    }
  } else {
    // Uncompressed pubkey
    // M = 04 || X || Y
    enc.unshift(0x04);
    enc = enc.concat(integerToBytes(y, 32));
  }

  return enc;
};

/**
 * @param {Curve} curve
 * @param {number[]} enc
 * @return {Point}
 */
Point.decodeFrom = function (curve, enc) {
  var type = enc[0];
  var dataLen = enc.length - 1;

  // Extract x and y as byte arrays
  var xBa = enc.slice(1, 1 + dataLen / 2);
  var yBa = enc.slice(1 + dataLen / 2, 1 + dataLen);

  // Prepend zero byte to prevent interpretation as negative integer
  xBa.unshift(0);
  yBa.unshift(0);

  // Convert to BigIntegers
  var x = new BigInteger(xBa);
  var y = new BigInteger(yBa);

  // Return point
  return new Point(curve, curve.fromBigInteger(x), curve.fromBigInteger(y));
};

/**
 * @param {Point} b
 * @return {Point}
 */
Point.prototype.add2D = function (b) {
  if(this.isInfinity()) return b;
  if(b.isInfinity()) return this;

  if (this.x.equals(b.x)) {
    if (this.y.equals(b.y)) {
      // this = b, i.e. this must be doubled
      return this.twice();
    }
    // this = -b, i.e. the result is the point at infinity
    return this.curve.getInfinity();
  }

  var x_x = b.x.subtract(this.x);
  var y_y = b.y.subtract(this.y);
  var gamma = y_y.divide(x_x);

  var x3 = gamma.square().subtract(this.x).subtract(b.x);
  var y3 = gamma.multiply(this.x.subtract(x3)).subtract(this.y);

  return new Point(this.curve, x3, y3);
};

/**
 * @return {Point}
 */
Point.prototype.twice2D = function () {
  if (this.isInfinity()) return this;
  if (this.y.toBigInteger().signum() == 0) {
    // if y1 == 0, then (x1, y1) == (x1, -y1)
    // and hence this = -this and thus 2(x1, y1) == infinity
    return this.curve.getInfinity();
  }

  var TWO = this.curve.fromBigInteger(BigInteger.valueOf(2));
  var THREE = this.curve.fromBigInteger(BigInteger.valueOf(3));
  var gamma = this.x.square().multiply(THREE).add(this.curve.a).divide(this.y.multiply(TWO));

  var x3 = gamma.square().subtract(this.x.multiply(TWO));
  var y3 = gamma.multiply(this.x.subtract(x3)).subtract(this.y);

  return new Point(this.curve, x3, y3);
};

/**
 * @param {BigInteger} k
 * @return {Point}
 */
Point.prototype.multiply2D = function (k) {
  if (this.isInfinity()) {
    return this;
  }

  if (k.signum() == 0) {
    return this.curve.getInfinity();
  }

  var e = k;
  var h = e.multiply(new BigInteger("3"));
  var neg = this.negate();
  var R = this;

  for (var i = h.bitLength() - 2; i > 0; --i) {
    R = R.twice();

    var hBit = h.testBit(i);
    var eBit = e.testBit(i);

    if (hBit != eBit) {
      R = R.add2D(hBit ? this : neg);
    }
  }

  return R;
};

/**
 * @return {boolean}
 */
Point.prototype.isOnCurve = function () {
  var x = this.getX().toBigInteger();
  var y = this.getY().toBigInteger();
  var a = this.curve.getA().toBigInteger();
  var b = this.curve.getB().toBigInteger();
  var n = this.curve.getQ();
  var lhs = y.multiply(y).mod(n);
  var rhs = x.multiply(x).multiply(x).add(a.multiply(x)).add(b).mod(n);

  return lhs.equals(rhs);
};

/**
 * @return {string}
 */
Point.prototype.toString = function () {
  return '('+this.getX().toBigInteger().toString()+','+
    this.getY().toBigInteger().toString()+')';
};

/**
 * Validate an elliptic curve point.
 *
 * See SEC 1, section 3.2.2.1: Elliptic Curve Public Key
 * Validation Primitive
 *
 * @return {boolean}
 * @throws {Error}
 */
Point.prototype.validate = function () {
  var n = this.curve.getQ();

  // Check Q != O
  if (this.isInfinity()) {
    throw new Error("Point is at infinity.");
  }

  // Check coordinate bounds
  var x = this.getX().toBigInteger();
  var y = this.getY().toBigInteger();
  if (x.compareTo(BigInteger.ONE) < 0 ||
      x.compareTo(n.subtract(BigInteger.ONE)) > 0) {
    throw new Error('x coordinate out of bounds');
  }
  if (y.compareTo(BigInteger.ONE) < 0 ||
      y.compareTo(n.subtract(BigInteger.ONE)) > 0) {
    throw new Error('y coordinate out of bounds');
  }

  // Check y^2 = x^3 + ax + b (mod n)
  if (!this.isOnCurve()) {
    throw new Error("Point is not on the curve.");
  }

  // Check nQ = 0 (Q is a scalar multiple of G)
  if (this.multiply(n).isInfinity()) {
    // TODO: This check doesn't work - fix.
    throw new Error("Point is not a scalar multiple of G.");
  }

  return true;
};

// prepends 0 if bytes < len
// cuts off start if bytes > len
function integerToBytes(i, len) {
  var bytes = i.toByteArrayUnsigned();

  if (len < bytes.length) {
    bytes = bytes.slice(bytes.length-len);
  } else while (len > bytes.length) {
    bytes.unshift(0);
  }

  return bytes;
};

module.exports = Point;