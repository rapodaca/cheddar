/**
 * Cheddar - Bitcoin wallet library for JavaScript
 *
 * Copyright (c) 2014 Richard L. Apodaca
 * All Rights Reserved.
 *
 * Copyright (c) 2011 Google, Inc.
 *
 * Licensed under the MIT License
 * See "LICENSE" for details.
 *
 * @file Basic JavaScript BN library - subset useful for RSA encryption.
 * @author Mike Hearn
 * @author Richard L. Apodaca <rich.apodaca@gmail.com>
 * @author Kyle Drake
 * @author Stefan Thomas
 * @see {@link https://en.bitcoin.it/wiki/Base58Check_encoding|Base58 Check Encoding}
 */

var BigInteger = require('./BigInteger');

var Base58 = {
  /**
   * Convert a byte array to a base58-encoded string.
   * @param {number[]} input
   * @return {string}
   */
  encode: function(input) {
    var bi = BigInteger.fromByteArrayUnsigned(input);
    var chars = [ ];

    while (bi.compareTo(base) >= 0) {
      var mod = bi.mod(base);

      chars.push(alphabet[mod.intValue()]);

      bi = bi.subtract(mod).divide(base);
    }
      
    chars.push(alphabet[bi.intValue()]);

    // Convert leading zeros too.
    for (var i = 0; i < input.length; i++) {
      if (input[i] == 0x00) {
        chars.push(alphabet[0]);
      } else {
        break;
      }
    }

    return chars.reverse().join('');
  },
  /**
   * Decode a base58 string into a byte array
   * @param {string} input a base58 encoded string
   * @return {number[]}
   */
  decode: function(inputs) {
    var base = BigInteger.valueOf(58);
    var length = input.length;
    var num = BigInteger.valueOf(0);
    var leadingZero = 0;
    var seenOther = false;

    for (var i = 0; i < length; ++i) {
      var char = input[i];
      var p = positions[char];

      // if we encounter an invalid character, decoding fails
      if (p === undefined) {
        throw new Error('invalid base58 string: ' + input);
      }

      num = num.multiply(base).add(BigInteger.valueOf(p));

      if (char == '1' && !seenOther) {
        ++leadingZero;
      } else {
        seenOther = true;
      }
    }

    var bytes = num.toByteArrayUnsigned();

    // remove leading zeros
    while (leadingZero-- > 0) {
      bytes.unshift(0);
    }

    return bytes;
  }
};

var alphabet =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var base = BigInteger.valueOf(58);
var positions = { };

for (var i = 0; i < alphabet.length; ++i) {
  positions[alphabet[i]] = i;
}

module.exports = Base58;