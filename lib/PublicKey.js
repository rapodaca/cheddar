/**
 * Cheddar - Bitcoin wallet library for JavaScript
 *
 * Copyright (c) 2014 Richard L. Apodaca
 * All Rights Reserved.
 *
 * Licensed under the MIT License
 * See "LICENSE" for details.
 *
 * @author Richard L. Apodaca <rich.apodaca@gmail.com>
 */

var Support = require('./Support');
var Network = require('./Networks');

/**
 * @param {PrivateKey} privateKey
 */
var PublicKey = function(privateKey) {
  this._point = privateKey.getPoint();
  this._network = privateKey.getNetwork();
};

/**
 * @param {boolean} [compressed]
 * @return {string}
 */
PublicKey.prototype.getAddress = function(compressed) {
  var hash = this.toRIPEMD160(compressed);
  var addressVersion = Network[this._network]['addressVersion'];
  var versionedHash = [addressVersion].concat(hash);

  return Support.bytesToSerializedBase58(versionedHash);
};

/**
 * @param {boolean} [compressed]
 * @return {number[]}
 */
PublicKey.prototype.toRIPEMD160 = function(compressed) {
  var bytes = this._point.getEncoded(compressed);
  var hash = Support.bytesToSHA256(bytes);

  return Support.bytesToRIPEMD160(hash);
};

/**
 * @param {boolean} compressed
 * @return {string}
 */
PublicKey.prototype.toFingerprint = function(compressed) {
  var hash = this.toRIPEMD160(compressed);

  return hash.slice(0, 4);
};

/**
 * @param {boolean} [compressed]
 * @return {string}
 */
PublicKey.prototype.toHex = function(compressed) {
  var bytes = this._point.getEncoded(compressed);

  return Support.bytesToHex(bytes);
};

/**
 * @param {boolean} [compressed]
 * @return {number[]}
 */
PublicKey.prototype.toBytes = function(compressed) {
  return this._point.getEncoded(compressed);
};

module.exports = PublicKey;