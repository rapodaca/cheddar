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

/**
 * @constructor
 * @param {BigInteger} q
 * @param {BigInteger} x
 */
function FieldElement(q, x) {
    this.x = x;
    // TODO if(x.compareTo(q) >= 0) error
    this.q = q;
};

/**
 * @param {FieldElement} other
 */
FieldElement.prototype.equals =function(other) {
  if (other == this) {
    return true;
  }

  return (this.q.equals(other.q) && this.x.equals(other.x));
};

/**
 * @return {BigInteger}
 */
FieldElement.prototype.toBigInteger = function() {
  return this.x;
};

/**
 * @return {FieldElement}
 */
FieldElement.prototype.negate = function() {
  return new FieldElement(this.q, this.x.negate().mod(this.q));
};

/**
 * @return {FieldElement}
 */
FieldElement.prototype.add = function(b) {
  return new FieldElement(this.q, this.x.add(b.toBigInteger()).mod(this.q));
};

/**
 * @return {FieldElement}
 */
FieldElement.prototype.subtract = function(b) {
  return new FieldElement(this.q, this.x.subtract(b.toBigInteger()).mod(this.q));
};

/**
 * @return {ECFieldElement}
 */
FieldElement.prototype.multiply = function(b) {
  return new FieldElement(this.q, this.x.multiply(b.toBigInteger()).mod(this.q));
}

/**
 * @return {FieldElement}
 */
FieldElement.prototype.square = function() {
  return new FieldElement(this.q, this.x.square().mod(this.q));
}

/**
 * @return {FieldElement}
 */
FieldElement.prototype.divide = function(b) {
  return new FieldElement(this.q, this.x.multiply(b.toBigInteger().modInverse(this.q)).mod(this.q));
};

FieldElement.prototype.getByteLength = function () {
  return Math.floor((this.toBigInteger().bitLength() + 7) / 8);
};

module.exports = FieldElement;