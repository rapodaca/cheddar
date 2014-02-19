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

var Networks = require('./Networks');
var Support = require('./Support');
var Curve = require('./Curve');
var BigInteger = require('./BigInteger');

/**
 * @param {string} hexKey
 * @param {object} [options]
 * @param {string} [options.network] 'bitcoin'|'testnet'
 */
var PrivateKey = function(hexKey, options) {
  if (!/^[0-9a-f]{64}$/.test(hexKey.toLowerCase())) {
    throw new Error('Key must be a valid 64-character hex string');
  }
  
  options = options || { };
  this._network = options['network'] || 'bitcoin';
  this._key = Support.hexToBytes(hexKey);
};

/**
 * @return {string}
 */
PrivateKey.prototype.toHex = function() {
  return Support.bytesToHex(this._key);
};

/**
 * @return {string} for example:
 *                  5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD
 */
PrivateKey.prototype.toWIF = function() {
  var source = [Networks[this._network]['privateKeyVersion']].concat(this._key);
  var hash = Support.sha256(source);
  var secondHash = Support.sha256(hash);
  var checksum = secondHash.slice(0, 4);
  var checksummedSource = checksum.concat(source);
  var sourceWithChecksum = source.concat(checksum);

  return Support.base58(sourceWithChecksum);
};

/**
 * @return {string}
 */
PrivateKey.prototype.getNetwork = function() {
  return this._network;
};

/**
 * @param {boolean} [compressed]
 * @return {number[]}
 */
PrivateKey.prototype.getEncodedPoint = function(compressed) {
  var curve = Curve.fromDomainParameters('secp256k1');
  var g = curve.getG();
  var point = g.multiply(BigInteger.fromHex(this.toHex()));

  return point.getEncoded(compressed);
};

module.exports = PrivateKey;