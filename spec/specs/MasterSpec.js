describe("Master", function() {
  var Master, Support;
  beforeEach(function() {
    Master = require('Master');
    Support = require('Support');
  });
  describe("Test vector 1", function() {
    var master;
    beforeEach(function() {
      master = new Master('000102030405060708090a0b0c0d0e0f');
    });
    describe("#getIndex", function() {
      it("returns 0", function() {
        expect(master.getIndex()).toEqual(0);
      });
    });
    describe("#isPrivate", function() {
      it("returns 0", function() {
        expect(master.isPrivate()).toBe(true);
      });
    });
    describe("#getDepth", function() {
      it("returns 0", function() {
        expect(master.getDepth()).toEqual(0);
      });
    });
    describe("#toIdentifier", function() {
      it("returns the expected identifier", function() {
        expect(master.toIdentifier()).toEqual('3442193e1bb70916e914552172cd4e2dbc9df811');
      });
    });
    describe("#toFingerprint", function() {
      it("returns the expected fingerprint", function() {
        var bytes = master.toFingerprint();

        expect(Support.bytesToHex(bytes)).toEqual('3442193e');
      });
    });
    describe("#toAddress", function() {
      it("returns ths expected address", function() {
        expect(master.toAddress()).toEqual('15mKKb2eos1hWa6tisdPwwDC1a5J1y9nma');
      });
    });
    describe("#getPrivateKey", function() {
      it("returns key with expected hex", function() {
        var key = master.getPrivateKey();

        expect(key.toHex()).toEqual('e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35');
      });
      it("returns key with expected WIF", function() {
        var key = master.getPrivateKey();

        expect(key.toWIF(true)).toEqual('L52XzL2cMkHxqxBXRyEpnPQZGUs3uKiL3R11XbAdHigRzDozKZeW');
      });
    });
    describe("#getPublicKey", function() {
      it("returns key with expected hex", function() {
        var publicKey = master.getPublicKey();

        expect(publicKey.toHex(true)).toEqual('0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2');
      });
    });
    describe("#getChainCode", function() {
      it("returns chain code", function() {
        var bytes = master.getChainCode();

        expect(Support.bytesToHex(bytes)).toEqual('873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508');
      });
    });
    describe("#getSerialized", function() {
      it("returns serialized private key", function() {
        var bytes = master.getSerialized({ type: 'private' });

        expect(Support.bytesToHex(bytes)).toEqual('0488ade4000000000000000000873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d50800e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35');
      });
      it("returns a serialized public key", function() {
        var bytes = master.getSerialized();

        expect(Support.bytesToHex(bytes)).toEqual('0488b21e000000000000000000873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d5080339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2');
      });
    });
    describe("#getSerializedAddress", function() {
      it("returns serialized address (public)", function() {
        expect(master.getSerializedAddress()).toEqual('xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8');
      });
      it("returns serialized address (private)", function() {
        expect(master.getSerializedAddress({ type: 'private' })).toEqual('xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi');
      });
    });
  });
  describe("Test vector 2", function() {
    var master;
    beforeEach(function() {
      master = new Master('fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542');
    });
    xdescribe("#getIndex", function() {
      it("returns 0", function() {
        expect(master.getIndex()).toEqual(0);
      });
    });
    xdescribe("#isPrivate", function() {
      it("returns 0", function() {
        expect(master.isPrivate()).toBe(true);
      });
    });
    xdescribe("#getDepth", function() {
      it("returns 0", function() {
        expect(master.getDepth()).toEqual(0);
      });
    });
    describe("#toIdentifier", function() {
      it("returns expected identifier", function() {
        expect(master.toIdentifier()).toEqual('bd16bee53961a47d6ad888e29545434a89bdfe95');
      });
    });
    describe("#toFingerprint", function() {
      it("returns expected fingerprint", function() {
        var bytes = master.toFingerprint();

        expect(Support.bytesToHex(bytes)).toEqual('bd16bee5');
      });
    });
    describe("#toAddress", function() {
      it("returns expected address", function() {
        expect(master.toAddress()).toEqual('1JEoxevbLLG8cVqeoGKQiAwoWbNYSUyYjg');
      });
    });
    describe("#getPrivateKey", function() {
      it("returns the expected private key", function() {
        var privateKey = master.getPrivateKey();

        expect(privateKey.toHex()).toEqual('4b03d6fc340455b363f51020ad3ecca4f0850280cf436c70c727923f6db46c3e');
      });
    });
    describe("#getPublicKey", function() {
      it("returns key with expected hex", function() {
        var publicKey = master.getPublicKey();

        expect(publicKey.toHex(true)).toEqual('03cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a7');
      });
    });
    describe("#getChainCodeHex", function() {
      it("returns chain code", function() {
        var bytes = master.getChainCode();

        expect(Support.bytesToHex(bytes)).toEqual('60499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd9689');
      });
    });
    describe("#getSerialized", function() {
      it("returns serialized private key", function() {
        var bytes = master.getSerialized({ type: 'private' });

        expect(Support.bytesToHex(bytes)).toEqual('0488ade400000000000000000060499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd9689004b03d6fc340455b363f51020ad3ecca4f0850280cf436c70c727923f6db46c3e');
      });
      it("returns a serialized public key", function() {
        var bytes = master.getSerialized();

        expect(Support.bytesToHex(bytes)).toEqual('0488b21e00000000000000000060499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd968903cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a7');
      });
    });
    describe("#getSerializedAddress", function() {
      it("returns serialized address (public)", function() {
        expect(master.getSerializedAddress()).toEqual('xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB');
      });
      it("returns serialized address (private)", function() {
        expect(master.getSerializedAddress({ type: 'private' })).toEqual('xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U');
      });
    });
  });
});