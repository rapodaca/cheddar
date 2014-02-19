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
  this._bytes = privateKey.getEncodedPoint();
  this._network = privateKey.getNetwork();
};

/**
 * @return {string}
 */
PublicKey.prototype.getAddress = function() {
  var hash = Support.sha256(this._bytes);
  hash = Support.ripemd160(hash);
  var addressVersion = Network[this._network]['addressVersion'];
  var versionedRIPEMD160 = [addressVersion].concat(hash);
  hash = Support.sha256(versionedRIPEMD160);
  hash = Support.sha256(hash);
  var checksum = hash.slice(0, 4);
  var address = versionedRIPEMD160.concat(checksum);

  return Support.base58(address);
};

module.exports = PublicKey;