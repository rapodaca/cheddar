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

describe("PrivateKey", function() {
  var PrivateKey, Support;
  var hexKey;
  beforeEach(function() {
    PrivateKey = require('PrivateKey');
    Support = require('Support');
    hexKey = '1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd';
  });
  describe("constructor", function() {
    it("generates a valid key given hex string", function() {
      var key = new PrivateKey(hexKey);

      expect(key.toHex()).toEqual(hexKey);
    });
    it("throws given length of hex is not 64", function() {
      expect(function() {
        new PrivateKey('abcd');
      }).toThrow(Error('Key must be a valid 64-character hex string'));
    });
    it("throws given string is not hex", function() {
      expect(function() {
        new PrivateKey('Heae5375fb5f7a0ea650566363befa2830ef441bdcb19198adf318faee86d64b');
      }).toThrow(Error('Key must be a valid 64-character hex string'));
    });
  });
  describe("#toWIF", function() {
    it("returns correct WIF given uncompressed", function() {
      var key = new PrivateKey(hexKey);

      expect(key.toWIF()).toEqual('5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD');
    });
    // https://bitcointalk.org/index.php?topic=129652.0
    it("returns correct WIF given compressed", function() {
      var key = new PrivateKey('19fdab0668a2586da7bea56410c814b83be86a956bb8565aea78651c174bfc04');

      expect(key.toWIF(true)).toEqual('Kx6EWgKRJ2GZuXbrDquQPAE8MWZLLdsT4YYgQs4hdF7rRL4jGLHx');
    });
  });
  describe("#getNetwork", function() {
    it("returns 'bitcoin' by default", function() {
      var key = new PrivateKey(hexKey);

      expect(key.getNetwork()).toEqual('bitcoin');
    });
    it("returns 'testnet' given network option", function() {
      var key = new PrivateKey(hexKey, { network: 'testnet' });

      expect(key.getNetwork()).toEqual('testnet');
    });
  });
  describe("#getPoint", function() {
    it("returns point", function() {
      var key = new PrivateKey(hexKey);
      var point = key.getPoint();

      expect(point.toString()).toEqual('(94350599354702991638115641145587378352504262019718045113528956524844218675055,85864489789504288907478294460159639524773840349397540705495360734885545997461)');
    });
  });
  describe("#getEncodedPoint", function() {
    it("returns uncompressed encoded point", function() {
      var key = new PrivateKey(hexKey);
      var bytes = key.getEncodedPoint();

      expect(Support.bytesToHex(bytes)).toEqual('04d0988bfa799f7d7ef9ab3de97ef481cd0f75d2367ad456607647edde665d6f6fbdd594388756a7beaf73b4822bc22d36e9bda7db82df2b8b623673eefc0b7495');
    });
    it("returns compressed encoded point", function() {
      var key = new PrivateKey(hexKey);
      var bytes = key.getEncodedPoint(true);

      expect(Support.bytesToHex(bytes)).toEqual('03d0988bfa799f7d7ef9ab3de97ef481cd0f75d2367ad456607647edde665d6f6f');
    });
  });
});