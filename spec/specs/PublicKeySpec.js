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
  var PublicKey, PrivateKey;
  var privateKey;
  beforeEach(function() {
    PublicKey = require('PublicKey');
    PrivateKey = require('PrivateKey');
  });
  describe("#toAddress", function() {
    it("returns address given valid private key", function() {
      var privateKey = new PrivateKey(
        '18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725'
      );
      var publicKey = new PublicKey(privateKey);

      expect(publicKey.getAddress()).toEqual('16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM');
    });
  });
});