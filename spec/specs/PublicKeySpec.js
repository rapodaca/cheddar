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
 * @see {@link https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses}
 */

describe("PublicKey", function() {
  var PublicKey, PrivateKey, Support;
  var privateKey;
  beforeEach(function() {
    PublicKey = require('PublicKey');
    PrivateKey = require('PrivateKey');
    Support = require('Support');
  });
  describe("#getAddress", function() {
    it("returns address given valid private key and uncompressed", function() {
      var privateKey = new PrivateKey(
        '18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725'
      );
      var publicKey = new PublicKey(privateKey);

      expect(publicKey.getAddress()).toEqual('16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM');
    });
    // https://bitcointalk.org/index.php?topic=129652.0
    it("returns address given valid private key", function() {
      var privateKey = new PrivateKey(
        '19fdab0668a2586da7bea56410c814b83be86a956bb8565aea78651c174bfc04'
      );
      var publicKey = new PublicKey(privateKey);

      expect(publicKey.getAddress(true)).toEqual('13pRRXkGVC9mhUSiw6xkYkMi1EX91VvsBE');
    });
  });
  describe("#toRIPEMD160", function() {
    it("returns hash given uncompressed", function() {
      var privateKey = new PrivateKey(
        '19fdab0668a2586da7bea56410c814b83be86a956bb8565aea78651c174bfc04'
      );
      var publicKey = new PublicKey(privateKey);
      var hash = publicKey.toRIPEMD160();

      expect(Support.bytesToHex(hash)).toEqual('f004774a5a7fc031dfb20391f199a4078f4fd537');
    });
    it("returns hash given compressed", function() {
      var privateKey = new PrivateKey(
        '19fdab0668a2586da7bea56410c814b83be86a956bb8565aea78651c174bfc04'
      );
      var publicKey = new PublicKey(privateKey);
      var hash = publicKey.toRIPEMD160(true);

      expect(Support.bytesToHex(hash)).toEqual('1ee83062e9554713b88c1a60bda5e14d0554a5a1');
    });
  });
  describe("#toFingerprint", function() {
    it("returns expected fingerprint", function() {
      var privateKey = new PrivateKey(
        '5eae5375fb5f7a0ea650566363befa2830ef441bdcb19198adf318faee86d64b'
      );
      var publicKey = new PublicKey(privateKey);
      var bytes = publicKey.toFingerprint(true);

      expect(Support.bytesToHex(bytes)).toEqual('1fddf42e');      
    });
  });
  describe("#toHex", function() {
    it("returns hex representation", function() {
      var privateKey = new PrivateKey(
        '5eae5375fb5f7a0ea650566363befa2830ef441bdcb19198adf318faee86d64b'
      );
      var publicKey = new PublicKey(privateKey);

      expect(publicKey.toHex()).toEqual('042dfc2557a007c93092c2915f11e8aa70c4f399a6753e2e908330014091580e4b11203096f1a1c5276a73f91b9465357004c2103cc42c63d6d330df589080d2e4');
    });
  });
});