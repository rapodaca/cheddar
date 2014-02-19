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

var RIPEMD160 = require('./RIPEMD160');
var SHA256 = require('./SHA256');
var Base58 = require('./Base58');

module.exports = {
  /**
   * @param {number[]} bytes
   * @return {number[]}
   */
  sha256: function(bytes) {
    return SHA256(bytes);
  },
  /**
   * @param {number[]} bytes
   * @return {number[]}
   */
  ripemd160: function(bytes) {
    return RIPEMD160(bytes);
  },
  base58: function(bytes) {
    return Base58.encode(bytes);
  },
  /**
   * @param {string} string
   * @return {number[]}
   */
  stringToBytes: function(string) {
    var result = [ ];

    for (var i = 0; i < string.length; i++) {
      result.push(string.charCodeAt(i));
    }

    return result;
  },
  /**
   * @param {string} hex
   * @return {number[]}
   * @throws {Error}
   */
  hexToBytes: function(hex) {
    if (hex.length % 2) {
      throw new Error('Hex string length may not be odd');
    }

    var result = [ ];

    for (var i = 0; i < hex.length; i += 2) {
      result.push(parseInt(hex.substr(i, 2), 16));
    }

    return result;
  },
  /**
   * @param {number[]} bytes
   * @return {string}
   */
  bytesToHex: function(bytes) {
    var hex = [ ];

    for (var i = 0; i < bytes.length; i++) {
      hex.push((bytes[i] >>> 4).toString(16));
      hex.push((bytes[i] & 0xf).toString(16));
    }

    return hex.join('');
  }
};