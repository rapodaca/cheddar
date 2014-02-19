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
 * @author Tom Wu <tjw@cs.stanford.edu>
 * @author Richard L. Apodaca <rich.apodaca@gmail.com>
 * @author Kyle Drake
 */

var BigInteger = require('./BigInteger');
var FieldElement = require('./FieldElement');
var Point = require('./Point');

/**
 * @param {object} curveParams
 * @param {BigInteger} curveParams.p
 * @param {BigInteger} curveParams.a
 * @param {BigInteger} curveParams.b
 * @param {object} curveParams.G
 * @param {string} curveParams.G.uncompressed 
 */
var Curve = function(curveParams) {
  this.q = curveParams.p;
  this.a = this.fromBigInteger(curveParams.a);
  this.b = this.fromBigInteger(curveParams.b);
  this.g = this.decodePointHex(curveParams.G.uncompressed);
  this.infinity = new Point(this, null, null);
}

/**
 * @return {BigInteger}
 */
Curve.prototype.getQ = function() {
  return this.q;
};

/**
 * @return {BigIntegert}
 */
Curve.prototype.getA = function() {
  return this.a;
};

/**
 * @return {BigInteger}
 */
Curve.prototype.getB = function() {
  return this.b;
};

/**
 * @return {BigInteger}
 */
Curve.prototype.getG = function() {
  return this.g;
};

/**
 * @param {Curve} other
 * @return {boolean}
 */
Curve.prototype.equals = function(other) {
  if (other == this) {
    return true;
  }
  
  return (this.q.equals(other.q) && this.a.equals(other.a) && this.b.equals(other.b));
};

/**
 * @return {Point}
 */
Curve.prototype.getInfinity = function() {
  return this.infinity;
};

/**
 * @return {FieldElement}
 */
Curve.prototype.fromBigInteger = function(x) {
  return new FieldElement(this.q, x);
};

/**
 * for now, work with hex strings because they're easier in JS
 *
 * @param {string} s
 * @return {Point}
 */
Curve.prototype.decodePointHex = function(s) {
  switch (parseInt(s.substr(0,2), 16)) { // first byte
    case 0:
      return this.infinity;
    case 2:
    case 3:
      // point compression not supported yet
      return null;
    case 4:
    case 6:
    case 7:
      var len = (s.length - 2) / 2;
      var xHex = s.substr(2, len);
      var yHex = s.substr(len+2, len);

      return new Point(this,
           this.fromBigInteger(new BigInteger(xHex, 16)),
           this.fromBigInteger(new BigInteger(yHex, 16)));
    default: // unsupported
      return null;
  }
};

/**
 * prepends 0 if bytes < len
 * cuts off start if bytes > len
 */
function integerToBytes(i, len) {
  var bytes = i.toByteArrayUnsigned();

  if (len < bytes.length) {
    bytes = bytes.slice(bytes.length-len);
  } else while (len > bytes.length) {
    bytes.unshift(0);
  }

  return bytes;
};

/**
 * @param {string} name the name of a curve, as defined in
 *                 http://www.secg.org/collateral/sec2_final.pdf
 *                 currently only 'secp256k1' is supported
 */
Curve.fromDomainParameters = function(name) {
  var params = Curve.DomainParameters[name];

  return new Curve(params);
};

/**
 * From: http://www.secg.org/collateral/sec2_final.pdf
 */
Curve.DomainParameters = {
  secp256k1: {
    p: new BigInteger(
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF' +
        'FFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16
       ),
    a: BigInteger.ZERO,
    b: new BigInteger('7', 16),
    n: new BigInteger(
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE' +
        'BAAEDCE6AF48A03BBFD25E8CD0364141', 16
       ),
    h: BigInteger.ONE,
    G: {
      uncompressed: '04' +
                    '79BE667EF9DCBBAC55A06295CE870B07' +
                    '029BFCDB2DCE28D959F2815B16F81798' +
                    '483ADA7726A3C4655DA4FBFC0E1108A8' +
                    'FD17B448A68554199C47D08FFB10D4B8',
      compressed:   '02' +
                    '79BE667EF9DCBBAC55A06295CE870B07' +
                    '029BFCDB2DCE28D959F2815B16F81798'
    }
  }
};

module.exports = Curve;