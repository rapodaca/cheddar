var PrivateKey = require('./PrivateKey');
var PublicKey = require('./PublicKey');
var Support = require('./Support');

/**
 * @param {string} [seed] hex format
 */
var Master = function(seed) {
  this._seed = Support.hexToBytes(seed);
  this._seedHash = Support.hmacSHA512(HD_WALLET_BASE_KEY, this._seed);

  var leftFromHash = Support.bytesToHex(this._seedHash.slice(0, 32));
  this._privateKey = new PrivateKey(leftFromHash);
};

/**
 * @return {number}
 */
Master.prototype.getIndex = function() {
  return 0;
};

/**
 * @return {boolean}
 */
Master.prototype.isPrivate = function() {
  return true;
};

/**
 * @return {number}
 */
Master.prototype.getDepth = function() {
  return 0;
};

/**
 * @return {PrivateKey}
 */
Master.prototype.getPrivateKey = function() {
  return this._privateKey;
};

/**
 * @return {PublicKey}
 */
Master.prototype.getPublicKey = function() {
  return new PublicKey(this._privateKey);
};

/**
 * @return {string}
 */
Master.prototype.toIdentifier = function() {
  var publicKey = this.getPublicKey();
  var hash = publicKey.toRIPEMD160(true);

  return Support.bytesToHex(hash);
};

/**
 * @return {number[]}
 */
Master.prototype.toFingerprint = function() {
  var publicKey = this.getPublicKey();

  return publicKey.toFingerprint(true);
};

/**
 * @return {string}
 */
Master.prototype.toAddress = function() {
  var key = this.getPublicKey();

  return key.getAddress(true);
};

/**
 * @return {number[]}
 */
Master.prototype.getChainCode = function() {
  var bytes = this._seedHash;
  var rightFromHash = bytes.slice(bytes.length - 32);

  return rightFromHash;
};

/**
 * @param {object} [options]
 * @param {string} [options.type] 'public'|'private'
 * @return {number[]}
 */
Master.prototype.getSerialized = function(options) {
  options = options || { type: 'public' }

  var keyVersion = options.type === 'public' ?
    [0x04, 0x88, 0xb2, 0x1e] : [0x04, 0x88, 0xad, 0xe4];
  var keyBytes = options.type === 'private' ?
    [0x00].concat(this.getPrivateKey().toBytes()) :
    this.getPublicKey().toBytes(true);

  var result = keyVersion
    .concat([0x00])
    .concat([0x00, 0x00, 0x00, 0x00])
    .concat([0x00, 0x00, 0x00, 0x00])
    .concat(this.getChainCode())
    .concat(keyBytes);

  return result;
};

/**
 * @param {object} [options]
 * @param {string} [options.type] 'public'|'private'
 * @return {string}
 */
Master.prototype.getSerializedAddress = function(options) {
  var bytes = this.getSerialized(options);

  return Support.bytesToSerializedBase58(bytes);
};

var HD_WALLET_BASE_KEY = Support.stringToBytes('Bitcoin seed');

module.exports = Master;