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

var Base58 = require('./Base58');
var Hashes = require('jshashes');
var RIPEMD160 = new Hashes.RMD160({ utf8: false });
var SHA256 = new Hashes.SHA256({ utf8: false });
var SHA512 = new Hashes.SHA512({ utf8: false });

module.exports = {
  /**
   * @param {number[]} bytes
   * @return {number[]}
   */
  bytesToSHA256: function(bytes) {
    var message = this.bytesToString(bytes);

    return this.hexToBytes(SHA256.hex(message));
  },
  /**
   * @param {number[]} key
   * @param {number[]} message
   * @return {number[]}
   */
  hmacSHA512: function(key, message) {
    var key = this.bytesToString(key);
    var message = this.bytesToString(message);
    var hmac = SHA512.hex_hmac(key, message);

    return this.hexToBytes(hmac);
  },
  /**
   * @param {number[]} bytes
   * @return {number[]}
   */
  bytesToRIPEMD160: function(bytes) {
    var message = this.bytesToString(bytes);

    return this.hexToBytes(RIPEMD160.hex(message));
  },
  /** 
   * @param {number[]} bytes
   * @return {string}
   */
  bytesToBase58: function(bytes) {
    return Base58.encode(bytes);
  },
  /**
   * @param {number[]} bytes
   * @return {string}
   */
  bytesToSerializedBase58: function(bytes) {
    var hash = this.bytesToSHA256(bytes);
    hash = this.bytesToSHA256(hash);
    var checksum = hash.slice(0, 4);
    var address = bytes.concat(checksum);

    return this.bytesToBase58(address);
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
   * @param {number[]} bytes
   * @return {string}
   */
  bytesToString: function(bytes) {
    var result = '';

    for (var i = 0; i < bytes.length; i++) {
      result += String.fromCharCode(bytes[i]);
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