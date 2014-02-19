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

describe("BigInteger", function() {
  var BigInteger;
  beforeEach(function() {
    BigInteger = require('BigInteger');
  });
  describe("constructor", function() {
    it("accepts (String), defaulting to base-10", function() {
      var i = new BigInteger('8675309');

      expect(i.toString()).toEqual('8675309');
    });
    it("accepts (String, Number) as radix", function() {
      var i = new BigInteger('ffff', 16);

      expect(i.toString()).toEqual((0xffff).toString(10));
    });
  });
  describe("#fromByteArrayUnsigned", function() {
    it("returns 0 given no empty array", function() {
      expect(BigInteger.fromByteArrayUnsigned([ ]).toString(10)).toEqual('0');
    });
    it("returns ...", function() {
      var i = BigInteger.fromByteArrayUnsigned([
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88
      ]);

      expect(i.toString(16)).toEqual('1122334455667788');
    });
  });
  describe("#fromHex", function() {
    it("returns BigInteger given hex representation", function() {
      expect(BigInteger.fromHex('abcdef').toString(16)).toEqual('abcdef');
    });
  });
  describe("#add", function() {
    it("adds number", function() {
      var a = new BigInteger('25');
      var b = new BigInteger('1002');

      expect(a.add(b).toString(10)).toEqual('1027');
    });
  });
  describe("#subtract", function() {
    it("subtracts number", function() {
      var a = new BigInteger('25');
      var b = new BigInteger('12');

      expect(a.subtract(b).toString()).toEqual('13');
    });
  });
  describe("#multiply", function() {
    it("multiplies number", function() {
      var a = new BigInteger('10');
      var b = new BigInteger('100');

      expect(a.multiply(b).toString(10)).toEqual('1000');
    });
  });
  describe("#divide", function() {
    it("divides number", function() {
      var a = new BigInteger('100')
      var b = new BigInteger('10');

      expect(a.divide(b).toString()).toEqual('10');
    });
    it("discards remainder and does not round up", function() {
      var a = new BigInteger('109');
      var b = new BigInteger('10');

      expect(a.divide(b).toString()).toEqual('10');
    });
  });
  describe("#shiftLeft", function() {
    it("returns a number right-padded with 0", function() {
      var i = new BigInteger('101010101010', 2);

      expect(i.shiftLeft(1).toString(2)).toEqual('1010101010100');
    });
  });
  describe("shiftRight", function() {
    it("returns a number left-padded with 0", function() {
      var i = new BigInteger('101010101010', 2);

      expect(i.shiftRight(1).toString(2)).toEqual('10101010101');
    });
  });
  describe("#toByteArraySigned", function() {
    it("returns byte array without sign on first element given positive", function() {
      var i = new BigInteger('0102030405060708090a', 16);

      expect(i.toByteArraySigned()).toEqual([
        0x01, 0x02, 0x03, 0x04,
        0x05, 0x06, 0x07, 0x08,
        0x09, 0x0a
      ]);
    });
    it("returns byte array with sign on first element given negative number", function() {
      var i = new BigInteger('-0102030405060708090a', 16);

      expect(i.toByteArraySigned()).toEqual([
        0x81, 0x02, 0x03, 0x04,
        0x05, 0x06, 0x07, 0x08,
        0x09, 0x0a
      ]);
    });
  });
  describe("#toByteArrayUnsigned", function() {
    it("returns byte array without sign on first element given positive", function() {
      var i = new BigInteger('0102030405060708090a', 16);

      expect(i.toByteArrayUnsigned()).toEqual([
        0x01, 0x02, 0x03, 0x04,
        0x05, 0x06, 0x07, 0x08,
        0x09, 0x0a
      ]);
    });
    it("returns byte array without sign on first element given negative", function() {
      var i = new BigInteger('-0102030405060708090a', 16);

      expect(i.toByteArrayUnsigned()).toEqual([
        0x01, 0x02, 0x03, 0x04,
        0x05, 0x06, 0x07, 0x08,
        0x09, 0x0a
      ]);
    });
  });
  describe("#intValue", function() {
    it("returns 0", function() {
      var i = new BigInteger('0');

      expect(i.intValue()).toEqual(0);
    });
    it("returns positive integer", function() {
      var i = new BigInteger('32767');

      expect(i.intValue()).toEqual(32767);
    });
    it("returns negative integer", function() {
      var i = new BigInteger('-32767');

      expect(i.intValue()).toEqual(-32767);
    });
  });
  describe("#valueOf", function() {
    it("returns ...", function() {
      var i = BigInteger.valueOf(8675309);

      expect(i.toString()).toEqual('8675309');
    });
  });
  describe("#compareTo", function() {
    it("returns 0 given equal", function() {
      var i = new BigInteger('32767');
      var j = new BigInteger('32767');

      expect(i.compareTo(j)).toEqual(0);
    });
    it("returns a positive number given smaller", function() {
      var i = new BigInteger('123456789012345');
      var j = new BigInteger('123456789013345');

      expect(j.compareTo(i) > 0).toBe(true);
    });
    it("returns a negative number given larger", function() {
      var i = new BigInteger('123456789012345');
      var j = new BigInteger('123456789013345');

      expect(i.compareTo(j) < 0).toBe(true);
    });
  });
});