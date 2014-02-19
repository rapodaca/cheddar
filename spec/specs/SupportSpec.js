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
 
describe("Support", function() {
  var Support, BigInteger;
  beforeEach(function() {
    Support = require('Support');
    BigInteger = require('BigInteger');
  });
  describe("#hexToBytes", function() {
    it("returns empty array given empty string", function() {
      expect(Support.hexToBytes('')).toEqual([]);
    });
    it("returns array given '0102030405060708090a0b0c0d0e0f'", function() {
      var hex = '0102030405060708090a0b0c0d0e0f';

      expect(Support.hexToBytes(hex)).toEqual([
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
      ]);
    });
    it("throws given odd length", function() {
      expect(function() {
        Support.hexToBytes('abcde')
      }).toThrow(Error('Hex string length may not be odd'));
    });
  });
  describe("#bytesToHex", function() {
    it("returns empty string given empty byte array", function() {
      expect(Support.bytesToHex([ ])).toEqual('');
    });
    it("returns hex string given byte array", function() {
      var bytes = [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
      ];
      var hex = '0102030405060708090a0b0c0d0e0f';

      expect(Support.bytesToHex(bytes)).toEqual(hex);
    });
  });
  describe("#sha256", function() {
    //http://www.nsrl.nist.gov/testdata/
    it("returns expected value given empty byte array", function() {
      expect(Support.sha256([])).toEqual([
        0xe3, 0xb0, 0xc4, 0x42, 0x98, 0xfc, 0x1c, 0x14,
        0x9a, 0xfb, 0xf4, 0xc8, 0x99, 0x6f, 0xb9, 0x24,
        0x27, 0xae, 0x41, 0xe4, 0x64, 0x9b, 0x93, 0x4c,
        0xa4, 0x95, 0x99, 0x1b, 0x78, 0x52, 0xb8, 0x55
      ]);
    });
    it("returns expected value given 'abc' byte array", function() {
      expect(Support.sha256([0x61, 0x62, 0x63])).toEqual([
        0xba, 0x78, 0x16, 0xbf, 0x8f, 0x01, 0xcf, 0xea,
        0x41, 0x41, 0x40, 0xde, 0x5d, 0xae, 0x22, 0x23,
        0xb0, 0x03, 0x61, 0xa3, 0x96, 0x17, 0x7a, 0x9c,
        0xb4, 0x10, 0xff, 0x61, 0xf2, 0x00, 0x15, 0xad
      ]);
    });
    it("returns expected value given 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq' byte array", function() {
      var bytes = [
        97, 98, 99, 100, 98, 99, 100, 101, 99, 100,
        101, 102, 100, 101, 102, 103, 101, 102, 103,
        104, 102, 103, 104, 105, 103, 104, 105, 106,
        104, 105, 106, 107, 105, 106, 107, 108, 106,
        107, 108, 109, 107, 108, 109, 110, 108, 109,
        110, 111, 109, 110, 111, 112, 110, 111, 112,
        113
      ];

      expect(Support.sha256(bytes)).toEqual([
        0x24, 0x8d, 0x6a, 0x61, 0xd2, 0x06, 0x38, 0xb8,
        0xe5, 0xc0, 0x26, 0x93, 0x0c, 0x3e, 0x60, 0x39,
        0xa3, 0x3c, 0xe4, 0x59, 0x64, 0xff, 0x21, 0x67,
        0xf6, 0xec, 0xed, 0xd4, 0x19, 0xdb, 0x06, 0xc1
      ]);
    });
    // Passes, but takes ~500 ms
    // it("returns expected value given 1M-'a' byte array", function() {
    //   var bytes = new Array(1000000);

    //   for (var i = 0; i < bytes.length; i++) {
    //     bytes[i] = 0x61;
    //   }

    //   expect(Support.sha256(bytes)).toEqual([
    //     0xcd, 0xc7, 0x6e, 0x5c, 0x99, 0x14, 0xfb, 0x92,
    //     0x81, 0xa1, 0xc7, 0xe2, 0x84, 0xd7, 0x3e, 0x67,
    //     0xf1, 0x80, 0x9a, 0x48, 0xa4, 0x97, 0x20, 0x0e,
    //     0x04, 0x6d, 0x39, 0xcc, 0xc7, 0x11, 0x2c, 0xd0
    //   ]);
    // });
  });
  describe("#base58", function() {
    // Test data from libbitcoin:
    // https://github.com/spesmilo/libbitcoin/blob/master/test/oldtests/base58-test.cpp
    it("returns expected result from libbitcoin", function() {
      var bytes = [
        0x00, 0x5c, 0xc8, 0x7f, 0x4a, 0x3f, 0xdf, 0xe3,
        0xa2, 0x34, 0x6b, 0x69, 0x53, 0x26, 0x7c, 0xa8,
        0x67, 0x28, 0x26, 0x30, 0xd3, 0xf9, 0xb7, 0x8e,
        0x64
      ];

      expect(Support.base58(bytes)).toEqual('19TbMSWwHvnxAKy12iNm3KdbGfzfaMFViT');
    });
  });
  // Test vectors from:
  // http://homes.esat.kuleuven.be/~bosselae/ripemd160.html
  describe("#ripemd160", function() {
    it("returns hash given ''", function() {
      expect(Support.ripemd160([ ])).toEqual([
        0x9c, 0x11, 0x85, 0xa5, 0xc5, 0xe9, 0xfc, 0x54,
        0x61, 0x28, 0x08, 0x97, 0x7e, 0xe8, 0xf5, 0x48,
        0xb2, 0x25, 0x8d, 0x31
      ]);
    });
    it("returns hash given 'a'", function() {
      var bytes = Support.stringToBytes('a');

      expect(Support.ripemd160(bytes)).toEqual([
        0x0b, 0xdc, 0x9d, 0x2d, 0x25, 0x6b, 0x3e, 0xe9,
        0xda, 0xae, 0x34, 0x7b, 0xe6, 0xf4, 0xdc, 0x83,
        0x5a, 0x46, 0x7f, 0xfe
      ]);
    });
    it("returns hash given 'abc'", function() {
      var bytes = Support.stringToBytes('abc');

      expect(Support.ripemd160(bytes)).toEqual([
        0x8e, 0xb2, 0x08, 0xf7, 0xe0, 0x5d, 0x98, 0x7a,
        0x9b, 0x04, 0x4a, 0x8e, 0x98, 0xc6, 0xb0, 0x87,
        0xf1, 0x5a, 0x0b, 0xfc
      ]);
    });
    it("returns hash given 'message digest'", function() {
      var bytes = Support.stringToBytes('message digest');

      expect(Support.ripemd160(bytes)).toEqual([
        0x5d, 0x06, 0x89, 0xef, 0x49, 0xd2, 0xfa, 0xe5,
        0x72, 0xb8, 0x81, 0xb1, 0x23, 0xa8, 0x5f, 0xfa,
        0x21, 0x59, 0x5f, 0x36
      ]);
    });
    it("returns hash given 'abcdefghijklmnopqrstuvwxyz", function() {
      var bytes = Support.stringToBytes('abcdefghijklmnopqrstuvwxyz');

      expect(Support.ripemd160(bytes)).toEqual([
        0xf7, 0x1c, 0x27, 0x10, 0x9c, 0x69, 0x2c, 0x1b,
        0x56, 0xbb, 0xdc, 0xeb, 0x5b, 0x9d, 0x28, 0x65,
        0xb3, 0x70, 0x8d, 0xbc
      ]);
    });
  });
});