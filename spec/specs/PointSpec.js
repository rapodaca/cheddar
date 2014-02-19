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

describe("Point", function() {
  var Curve, BigInteger, Support;
  var curve;
  beforeEach(function() {
    BigInteger = require('BigInteger');
    Support = require('Support');
    Curve = require('Curve');
    curve = Curve.fromDomainParameters('secp256k1');
  });
  describe("given secp256k1 curve test vectors", function() {
    var checkMultiply;
    beforeEach(function() {
      var g = curve.getG();

      checkMultiply = function(params) {
        var point = g.multiply(new BigInteger(params.m, 16));
        var x = point.getX().toBigInteger().toString(16);
        var y = point.getY().toBigInteger().toString(16);

        expect(x).toEqual(params.x);
        expect(y).toEqual(params.y);
      };
    });
    describe("#getEncoded", function() {
      // see:
      // https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses
      // http://sourceforge.net/mailarchive/forum.php?thread_name=CAPg%2BsBhDFCjAn1tRRQhaudtqwsh4vcVbxzm%2BAA2OuFxN71fwUA%40mail.gmail.com&forum_name=bitcoin-development
      it("returns uncompressed bytes given uncompressed", function() {
        var g = curve.getG();
        var point = g.multiply(new BigInteger('1111111111111111111111111111111111111111111111111111111111111111', 16));
        var hex = Support.bytesToHex(point.getEncoded(false));

        expect(hex).toEqual('044f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa385b6b1b8ead809ca67454d9683fcf2ba03456d6fe2c4abe2b07f0fbdbb2f1c1');
      });
      it("returns compressed bytes given compressed", function() {
        var g = curve.getG();
        var point = g.multiply(new BigInteger('1111111111111111111111111111111111111111111111111111111111111111', 16));
        var hex = Support.bytesToHex(point.getEncoded(true));

        expect(hex).toEqual('034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa');
      });
    });
    /**
     * Test vectors 1-5:
     * http://crypto.stackexchange.com/questions/784/
     *
     * Test vector 6:
     * http://procbits.com/2013/08/27/generating-a-bitcoin-address-with-javascript
     */
    describe("#multiply", function() {
      it("returns point 1", function() {
        checkMultiply({
          m: 'aa5e28d6a97a2479a65527f7290311a3624d4cc0fa1578598ee3c2613bf99522',
          x: '34f9460f0e4f08393d192b3c5133a6ba099aa0ad9fd54ebccfacdfa239ff49c6',
          y: 'b71ea9bd730fd8923f6d25a7a91e7dd7728a960686cb5a901bb419e0f2ca232'
        });
      });
      it("returns point 2", function() {
        checkMultiply({
          m: '7e2b897b8cebc6361663ad410835639826d590f393d90a9538881735256dfae3',
          x: 'd74bf844b0862475103d96a611cf2d898447e288d34b360bc885cb8ce7c00575',
          y: '131c670d414c4546b88ac3ff664611b1c38ceb1c21d76369d7a7a0969d61d97d'
        });
      });
      it("returns point 3", function() {
        checkMultiply({
          m: '6461e6df0fe7dfd05329f41bf771b86578143d4dd1f7866fb4ca7e97c5fa945d',
          x: 'e8aecc370aedd953483719a116711963ce201ac3eb21d3f3257bb48668c6a72f',
          y: 'c25caf2f0eba1ddb2f0f3f47866299ef907867b7d27e95b3873bf98397b24ee1'
        });
      });
      it("returns point 4", function() {
        checkMultiply({
          m: '376a3a2cdcd12581efff13ee4ad44c4044b8a0524c42422a7e1e181e4deeccec',
          x: '14890e61fcd4b0bd92e5b36c81372ca6fed471ef3aa60a3e415ee4fe987daba1',
          y: '297b858d9f752ab42d3bca67ee0eb6dcd1c2b7b0dbe23397e66adc272263f982'
        });
      });
      it("returns point 5", function() {
        checkMultiply({
          m: '1b22644a7be026548810c378d0b2994eefa6d2b9881803cb02ceff865287d1b9',
          x: 'f73c65ead01c5126f28f442d087689bfa08e12763e0cec1d35b01751fd735ed3',
          y: 'f449a8376906482a84ed01479bd18882b919c140d638307f0c0934ba12590bde'
        });
      });
      it("returns point 6", function() {
        checkMultiply({
          m: '1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD',
          x: 'd0988bfa799f7d7ef9ab3de97ef481cd0f75d2367ad456607647edde665d6f6f',
          y: 'bdd594388756a7beaf73b4822bc22d36e9bda7db82df2b8b623673eefc0b7495'
        })
      });
    });
  });
});