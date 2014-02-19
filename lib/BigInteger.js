/**
 * Cheddar - Bitcoin wallet library for JavaScript
 *
 * Copyright (c) 2014 Richard L. Apodaca
 * All Rights Reserved.
 *
 * Copyright (c) 2005 Tom Wu
 * All Rights Reserved.
 *
 * Copyright (c) 2013 Kyle Drake
 * All Rights Reserved.
 *
 * Licensed under the MIT License
 * See "LICENSE" for details.
 *
 * @file Basic JavaScript BN library - subset useful for RSA encryption.
 * @author Tom Wu <tjw@cs.stanford.edu>
 * @author Richard L. Apodaca <rich.apodaca@gmail.com>
 * @author Kyle Drake
 */

/**
 * @constructor
 * @param {String|Number} a
 * @param {Number|Random} [b]
 * @param {BigInteger|Random} [c]
 */
var BigInteger = function(a, b, c) {
  if(a) {
    if('number' == typeof a) {
      fromNumber(a, b, c, this);
    } else if (b == null && 'string' != typeof a) {
      fromString(a, 256, this);
    } else {
      fromString(a, b, this);
    }
  }
};

/**
 * this + a
 *
 * @param {BigInteger} a
 * @return {BigInteger}
 */
BigInteger.prototype.add = function(a) {
  var r = new BigInteger();

  addTo(a,r, this);

  return r;
};

/**
 * this - a
 *
 * @param {BigInteger} a
 * @return {BigInteger}
 */
BigInteger.prototype.subtract = function(a) {
  var r = new BigInteger();

  subTo(a,r, this);

  return r;
};

/**
 * this * a
 *
 * @param {BigInteger} a
 * @return {BigInteger}
 */
BigInteger.prototype.multiply = function(a) {
  var r = new BigInteger();

  multiplyTo(a,r, this);

  return r;
};

/**
 * this / a
 *
 * @param {BigInteger} a
 * @return {BigInteger}
 */
BigInteger.prototype.divide = function(a) {
  var r = new BigInteger();

  divRemTo(a,r,null, this);

  return r;
};

/**
 * this mod a
 *
 * @param {BigInteger} a
 * @return {BigInteger}
 */
BigInteger.prototype.mod = function(a) {
  var r = new BigInteger();

  divRemTo(a, null, r, this.abs());

  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
    subTo(r,r, a);
  }
  
  return r;
};

/**
 * this^2
 *
 * @return {BigInteger}
 */
BigInteger.prototype.square = function() {
  var r = new BigInteger();

  squareTo(r, this);
  
  return r;
};

/**
 * true iff this is even
 *
 * @return {boolean}
 */
BigInteger.prototype.isEven = function() {
  return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
};

/**
 * @reuturn {BigInteger}
 */
BigInteger.prototype.abs = function() {
  return (this.s <0 ) ? this.negate() : this;
};

/**
 * -this
 *
 * @return {BigInteger}
 */
BigInteger.prototype.negate = function() {
  var r = new BigInteger();

  subTo(this,r, BigInteger.ZERO);

  return r;
};

/**
 * @param {BigInteger} a
 * @return {boolean}
 */
BigInteger.prototype.equals = function(a) {
  return this.compareTo(a) == 0;
};

/**
 * return + if this > a, - if this < a, 0 if equal
 *
 * @param {BigInteger} a
 * @return {number}
 */
BigInteger.prototype.compareTo = function(a) {
  var r = this.s - a.s;

  if (r != 0) {
    return r;
  }

  var i = this.t;
  r = i - a.t;

  if (r != 0) {
    return (this.s < 0) ? -r : r;
  }

  while (--i >= 0) if((r = this[i] - a[i]) != 0) return r;

  return 0;
};

/**
 * @return {BigInteger}
 */
BigInteger.prototype.clone = function() {
  var r = new BigInteger();

  copyTo(r, this);

  return r;
};

/**
 * 0 if this == 0, 1 if this > 0
 *
 * @return {number}
 */
BigInteger.prototype.signum = function() {
  if (this.s < 0) {
    return -1;
  } else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
    return 0;
  } else {
    return 1;
  }
};

/**
 * return value as integer
 *
 * @return {number}
 */
BigInteger.prototype.intValue = function() {
  if(this.s < 0) {
    if(this.t == 1) {
      return this[0]-DV;
    } else if(this.t == 0) {
      return -1;
    }
  } else if(this.t == 1) {
    return this[0];
  } else if(this.t == 0) {
    return 0;
  }

  // assumes 16 < DB < 32
  return ((this[1] & ((1 << (32 - BITS_PER_DIGIT)) - 1)) << BITS_PER_DIGIT) | this[0];
};

/**
 * this << n
 *
 * @param {number} n
 * @return {BigInteger}
 */
BigInteger.prototype.shiftLeft = function(n) {
  var r = new BigInteger();

  if (n < 0) {
    rShiftTo(-n, r, this);
  } else {
    lShiftTo(n,r, this);
  }

  return r;
};

/**
 * this >> n
 *
 * @param {number} n
 * @return {BigInteger}
 */
BigInteger.prototype.shiftRight = function(n) {
  var r = new BigInteger();

  if (n < 0) {
    lShiftTo(-n, r, this);
  } else {
    rShiftTo(n, r, this);
  }

  return r;
};

/**
 * Converts big integer to signed byte representation.
 *
 * The format for this value uses the most significant bit as a sign
 * bit. If the most significant bit is already occupied by the
 * absolute value, an extra byte is prepended and the sign bit is set
 * there.
 *
 * Examples:
 *
 *      0 =>     0x00
 *      1 =>     0x01
 *     -1 =>     0x81
 *    127 =>     0x7f
 *   -127 =>     0xff
 *    128 =>   0x0080
 *   -128 =>   0x8080
 *    255 =>   0x00ff
 *   -255 =>   0x80ff
 *  16300 =>   0x3fac
 * -16300 =>   0xbfac
 *  62300 => 0x00f35c
 * -62300 => 0x80f35c
 *
 * @return {number[]}
 */
BigInteger.prototype.toByteArraySigned = function() {
  var val = this.toByteArrayUnsigned();
  var neg = this.s < 0;

  // if the first bit is set, we always unshift
  // either unshift 0x80 or 0x00
  if (val[0] & 0x80) {
    val.unshift((neg) ? 0x80 : 0x00);
  }
  // if the first bit isn't set, set it if negative
  else if (neg) {
    val[0] |= 0x80;
  }

  return val;
};

/**
 * Returns a byte array representation of the big integer.
 *
 * This returns the absolute of the contained value in big endian
 * form. A value of zero results in an empty array.
 *
 * @return {number[]}
 */
BigInteger.prototype.toByteArrayUnsigned = function() {
  var ba = toByteArray(this.abs());

  // Empty array, nothing to do
  if (!ba.length) {
    return ba;
  }

  // remove leading 0
  if (ba[0] === 0) {
    ba = ba.slice(1);
  }

  // all values must be positive
  for (var i=0 ; i<ba.length ; ++i) {
    ba[i] = (ba[i] < 0) ? ba[i] + 256 : ba[i];
  }

  return ba;
};

/**
 * @param {number} b
 * @return {string}
 */
BigInteger.prototype.toString = function(b) {
  var self = this;

  if (self.s < 0) {
    return "-" + self.negate().toString(b);
  }

  var k;

  if (b == 16) {
    k = 4;
  } else if (b == 8) {
    k = 3;
  } else if(b == 2) {
    k = 1;
  } else if (b == 32) {
    k = 5;
  } else if(b == 4) {
    k = 2;
  } else {
    return toRadix(b, self);
  }

  var km = (1 << k) - 1;
  var d;
  var m = false;
  var r = "";
  var i = self.t;
  var p = BITS_PER_DIGIT - (i * BITS_PER_DIGIT) % k;

  if (i-- > 0) {
    if (p < BITS_PER_DIGIT && (d = self[i] >> p) > 0) {
      m = true;
      r = int2char(d);
    }

    while(i >= 0) {
      if(p < k) {
        d = (self[i] & ((1 << p) - 1)) << (k - p);
        d |= self[--i] >> (p += BITS_PER_DIGIT - k);
      } else {
        d = (self[i] >> (p -= k)) & km;

        if(p <= 0) {
          p += BITS_PER_DIGIT;
          --i;
        }
      }

      if (d > 0) {
        m = true;
      }

      if (m) {
        r += int2char(d);
      }
    }
  }

  return m ? r : '0';
};

/**
 * return the number of bits in "this"
 *
 * @return {number}
 */
BigInteger.prototype.bitLength = function() {
  if (this.t <= 0) {
    return 0;
  }

  return BITS_PER_DIGIT * (this.t - 1) + nbits(this[this.t-1] ^ (this.s & DM));
};

/**
 * 1/this % m (HAC 14.61)
 *
 * @param {BigInteger} m
 * @return {BigInteger}
 */
BigInteger.prototype.modInverse = function(m) {
  var ac = m.isEven();

  if ((this.isEven() && ac) || m.signum() == 0) {
    return BigInteger.ZERO;
  }

  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);

  while (u.signum() != 0) {
    while (u.isEven()) {
      rShiftTo(1, u, u);

      if (ac) {
        if (!a.isEven() || !b.isEven()) {
          addTo(this,a, a);
          subTo(m,b, b);
        }

        rShiftTo(1,a, a);
      }

      else if (!b.isEven()) {
        subTo(m, b, b);
      }

      rShiftTo(1, b, b);
    }

    while (v.isEven()) {
      rShiftTo(1,v, v);

      if (ac) {
        if (!c.isEven() || !d.isEven()) {
          addTo(this,c, c);
          subTo(m,d, d);
        }

        rShiftTo(1,c, c);
      }

      else if (!d.isEven()) {
        subTo(m,d, d);
      }

      rShiftTo(1, d, d);
    }

    if (u.compareTo(v) >= 0) {
      subTo (v, u, u);
      if (ac) {
        subTo(c,a, a);
      }

      subTo(d, b, b);
    }
    else {
      subTo(u,v, v);

      if (ac) {
        subTo(a, c, c);
      }

      subTo(b,d, d);
    }
  }

  if (v.compareTo(BigInteger.ONE) != 0) {
    return BigInteger.ZERO;
  }

  if (d.compareTo(m) >= 0) {
    return d.subtract(m);
  }

  if (d.signum() < 0) {
    addTo(m,d, d);
  } else {
    return d;
  }

  if (d.signum() < 0) {
    return d.add(m);
  } else {
    return d;
  }
};

/**
 * @param {number} n
 * @return {boolean}
 */
BigInteger.prototype.testBit = function(n) {
  var j = Math.floor(n / BITS_PER_DIGIT);

  if (j >= this.t) {
    return this.s != 0;
  }

  return (this[j] & (1 << (n % BITS_PER_DIGIT))) != 0;
};

/**
 * alternate constructor
 */
function fromNumber(a, b, c, self) {
  if('number' == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) {
      fromInt(1, self);
    } else {
      self.fromNumber(a, c, self, self);

      if(!self.testBit(a - 1)) {
        // force MSB set
        self.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, self);
      } 

      if (self.isEven()) {
        dAddOffset(1,0, self); // force odd
      }

      while(!self.isProbablePrime(b)) {
        dAddOffset(2,0, self);

        if(self.bitLength() > a) {
          subTo(BigInteger.ONE.shiftLeft(a-1),self, self);
        }
      }
    }
  } else {
    // new BigInteger(int,RNG)
    var x = new Array();
    var t = a & 7;

    x.length = (a >> 3) + 1;

    b.nextBytes(x);

    if (t > 0) {
      x[0] &= ((1<<t)-1);
    } else {
      x[0] = 0;
    }

    fromString(x, 256, self);
  }
};

function fromRadix(s, b, self) {
  fromInt(0, self);

  if(b == null) {
    b = 10;
  }

  var cs = chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;

  for (var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);

    if(x < 0) {
      if(s.charAt(i) == "-" && self.signum() == 0) {
        mi = true;
      }

      continue;
    }

    w = b * w + x;

    if(++j >= cs) {
      dMultiply(d, self);
      dAddOffset(w, 0, self);

      j = 0;
      w = 0;
    }
  }

  if(j > 0) {
    dMultiply(Math.pow(b, j), self);
    dAddOffset(w, 0, self);
  }

  if(mi) {
    subTo(self,self, BigInteger.ZERO);
  }
};

function toRadix(b, self) {
  if(b == null) {
    b = 10;
  }

  if (self.signum() == 0 || b < 2 || b > 36) {
    return '0';
  }

  var cs = chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a);
  var y = new BigInteger();
  var z = new BigInteger();
  var r = '';

  divRemTo(d, y, z, self);

  while(y.signum() > 0) {
    r = (a + z.intValue()).toString(b).substr(1) + r;

    divRemTo(d, y, z, y);
  }

  return z.intValue().toString(b) + r;
};

/**
 * r = this + a
 */
function addTo(a, r, self) {
  var i = 0;
  var c = 0;
  var m = Math.min(a.t, self.t);

  while(i < m) {
    c += self[i] + a[i];
    r[i++] = c & DM;
    c >>= BITS_PER_DIGIT;
  }

  if(a.t < self.t) {
    c += a.s;

    while(i < self.t) {
      c += self[i];
      r[i++] = c & DM;
      c >>= BITS_PER_DIGIT;
    }

    c += self.s;
  }
  else {
    c += self.s;
    while (i < a.t) {
      c += a[i];
      r[i++] = c & DM;
      c >>= BITS_PER_DIGIT;
    }

    c += a.s;
  }

  r.s = (c < 0) ? -1 : 0;

  if(c > 0) {
    r[i++] = c;
  } else if (c < -1) {
    r[i++] = DV + c;
  }

  r.t = i;

  clamp(r);
};

/**
 * this *= n, this >= 0, 1 < n < DV
 */
function dMultiply(n, self) {
  self[self.t] = am(0, n - 1, self, 0, 0, self.t, self);
  ++self.t;

  clamp(self);
};

/**
 * this += n << w words, this >= 0
 */
function dAddOffset(n,w, self) {
  if(n == 0) {
    return;
  }

  while (self.t <= w) {
    self[self.t++] = 0;
  }

  self[w] += n;

  while (self[w] >= DV) {
    self[w] -= DV;

    if (++w >= self.t) {
      self[self.t++] = 0;
    }

    ++self[w];
  }
};

function am(i, x, w, j, c, n, self) {
  while (--n >= 0) {
    var v = x * self[i++] + w[j] + c;
    c = Math.floor(v / 0x4000000);
    w[j++] = v & 0x3ffffff;
  }

  return c;
};

/**
 * return x s.t. r^x < DV
 */
function chunkSize(r) {
  return Math.floor(Math.LN2 * BITS_PER_DIGIT / Math.log(r));
};

function int2char(n) {
  return BI_RM.charAt(n);
}

function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// return bigint initialized to value
function nbv(i) {
  var r = new BigInteger();

  fromInt(i, r);

  return r;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if ((t = x >>> 16) != 0) {
    x = t;
    r += 16;
  }

  if ((t = x >> 8) != 0) {
    x = t;
    r += 8;
  }

  if ((t = x >> 4) != 0) {
    x = t;
    r += 4;
  }

  if ((t = x >> 2) != 0) {
    x = t;
    r += 2;
  }

  if ((t = x >> 1) != 0) {
    x = t;
    r += 1;
  }
  return r;
}

// (protected) copy this to r
function copyTo(r, self) {
  for (var i = self.t - 1; i >= 0; --i) {
    r[i] = self[i];
  } 

  r.t = self.t;
  r.s = self.s;
};

// (protected) set from integer value x, -DV <= x < DV
function fromInt(x, self) {
  self.t = 1;
  self.s = (x < 0) ? -1 : 0;

  if (x > 0) {
    self[0] = x;
  } else if (x < -1) {
    self[0] = x + DV;
  }

  else self.t = 0;
};

// (protected) set from string and radix
function fromString(s, b, self) {
  var k;

  if (b == 16) {
    k = 4;
  } else if(b == 8) {
    k = 3;
  } else if(b == 256) {
    k = 8; // byte array
  } else if(b == 2) {
    k = 1;
  } else if(b == 32) {
    k = 5;
  } else if(b == 4) {
    k = 2;
  }
  else {
    fromRadix(s, b, self);

    return;
  }

  self.t = 0;
  self.s = 0;

  var i = s.length;
  var mi = false;
  var sh = 0;

  while(--i >= 0) {
    var x = (k == 8) ? s[i] & 0xff : intAt(s,i);

    if(x < 0) {
      if(s.charAt(i) == "-") {
        mi = true;
      }

      continue;
    }

    mi = false;

    if(sh == 0) {
      self[self.t++] = x;
    } else if(sh+k > BITS_PER_DIGIT) {
      self[self.t-1] |= (x&((1<<(BITS_PER_DIGIT-sh))-1))<<sh;
      self[self.t++] = (x>>(BITS_PER_DIGIT-sh));
    } else {
      self[self.t-1] |= x<<sh;
    }

    sh += k;

    if (sh >= BITS_PER_DIGIT) {
      sh -= BITS_PER_DIGIT;
    }
  }

  if (k == 8 && (s[0]&0x80) != 0) {
    self.s = -1;
    if (sh > 0) {
      self[self.t-1] |= ((1 << (BITS_PER_DIGIT - sh)) - 1) << sh;
    }
  }

  clamp(self);

  if(mi) {
    subTo(self,self, BigInteger.ZERO);
  }
};

// (protected) clamp off excess high words
function clamp(self) {
  var c = self.s & DM;

  while (self.t > 0 && self[self.t - 1] == c) {
    --self.t;
  }
};

// (protected) r = this << n*DB
function dlShiftTo(n,r, self) {
  var i;

  for (i = self.t-1; i >= 0; --i) {
    r[i+n] = self[i];
  } 

  for (i = n-1; i >= 0; --i) {
    r[i] = 0;
  }

  r.t = self.t + n;
  r.s = self.s;
};

// (protected) r = this >> n*DB
function drShiftTo(n,r, self) {
  for (var i = n; i < self.t; ++i) {
    r[i-n] = self[i];
  } 

  r.t = Math.max(self.t - n, 0);
  r.s = self.s;
};


// (protected) r = this << n
function lShiftTo(n,r, self) {
  var bs = n % BITS_PER_DIGIT;
  var cbs = BITS_PER_DIGIT - bs;
  var bm = (1 << cbs) - 1;
  var ds = Math.floor(n / BITS_PER_DIGIT);
  var c = (self.s<<bs)&DM
  var i;

  for (i = self.t - 1; i >= 0; --i) {
    r[i + ds + 1] = (self[i] >> cbs) | c;
    c = (self[i] & bm) << bs;
  }

  for (i = ds - 1; i >= 0; --i) {
    r[i] = 0;
  }

  r[ds] = c;
  r.t = self.t + ds + 1;
  r.s = self.s;

  clamp(r);
};

// (protected) r = this >> n
function rShiftTo(n,r, self) {
  r.s = self.s;
  var ds = Math.floor(n / BITS_PER_DIGIT);

  if(ds >= self.t) {
    r.t = 0;

    return;
  }

  var bs = n % BITS_PER_DIGIT;
  var cbs = BITS_PER_DIGIT - bs;
  var bm = (1 << bs) - 1;
  r[0] = self[ds] >> bs;

  for(var i = ds+1; i < self.t; ++i) {
    r[i - ds - 1] |= (self[i] & bm) << cbs;
    r[i - ds] = self[i] >> bs;
  }

  if(bs > 0) r[self.t - ds - 1] |= (self.s & bm) << cbs;
  r.t = self.t - ds;

  clamp(r);
};

// (protected) r = this - a
function subTo(a, r, self) {
  var i = 0;
  var c = 0;
  var m = Math.min(a.t, self.t);

  while(i < m) {
    c += self[i] - a[i];
    r[i++] = c & DM;
    c >>= BITS_PER_DIGIT;
  }
  if(a.t < self.t) {
    c -= a.s;

    while(i < self.t) {
      c += self[i];
      r[i++] = c & DM;
      c >>= BITS_PER_DIGIT;
    }

    c += self.s;
  }
  else {
    c += self.s;

    while(i < a.t) {
      c -= a[i];
      r[i++] = c & DM;
      c >>= BITS_PER_DIGIT;
    }

    c -= a.s;
  }

  r.s = (c < 0) ? -1 : 0;

  if (c < -1) {
    r[i++] = DV + c;
  } else if(c > 0) {
    r[i++] = c;
  }

  r.t = i;
  
  clamp(r);
};

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function multiplyTo(a,r, self) {
  var x = self.abs();
  var y = a.abs();
  var i = x.t;
  r.t = i + y.t;

  while (--i >= 0) {
    r[i] = 0;
  }

  for (i = 0; i < y.t; ++i) {
    r[i + x.t] = am(0, y[i], r, i, 0, x.t, x);
  }

  r.s = 0;

  clamp(r);

  if (self.s != a.s) {
    subTo(r,r, BigInteger.ZERO);
  }
};

// (protected) r = this^2, r != this (HAC 14.16)
function squareTo(r, self) {
  var x = self.abs();
  var i = r.t = 2 * x.t;

  while(--i >= 0) r[i] = 0;

  for(i = 0; i < x.t - 1; ++i) {
    var c = am(i, x[i], r, 2 * i, 0, 1, x);

    if((r[i + x.t] += am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1, x)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }

  if (r.t > 0) {
    r[r.t - 1] += am(i, x[i], r, 2 * i, 0, 1, x);
  }

  r.s = 0;

  clamp(r);
};

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function divRemTo(m,q,r, self) {
  var pm = m.abs();

  if (pm.t <= 0) {
    return;
  }

  var pt = self.abs();

  if (pt.t < pm.t) {
    if (q != null) {
      fromInt(0, q);
    }

    if (r != null) {
      copyTo(r, self);
    }

    return;
  }

  if (r == null) {
    r = new BigInteger();
  }

  var y = new BigInteger();
  var ts = self.s;
  var ms = m.s;
  var nsh = BITS_PER_DIGIT - nbits(pm[pm.t - 1]);  // normalize modulus
  
  if (nsh > 0) {
    lShiftTo(nsh, y, pm);
    lShiftTo(nsh,r, pt);
  } else {
    copyTo(y, pm);
    copyTo(r, pt);
  }

  var ys = y.t;
  var y0 = y[ys - 1];

  if(y0 == 0) {
    return;
  }

  var yt = y0 * (1 << F1) + ((ys > 1) ? y[ys-2] >> F2 : 0);
  var d1 = FV / yt;
  var d2 = (1 << F1) / yt;
  var e = 1 << F2;
  var i = r.t;
  var j = i - ys;
  var t = (q == null) ? new BigInteger() : q;

  dlShiftTo(j,t, y);

  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    subTo(t, r, r);
  }

  dlShiftTo(ys, t, BigInteger.ONE);
  subTo(y, y, t); // "negative" y so we can replace sub with am later
  
  while(y.t < ys) {
    y[y.t++] = 0;
  }

  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i] == y0) ? DM:Math.floor(r[i] * d1 + (r[i-1] + e) * d2);

    if((r[i] += am(0, qd, r, j, 0, ys, y)) < qd) {  // Try it out
      dlShiftTo(j, t, y);
      subTo(t, r, r);

      while (r[i] < --qd) {
        subTo(t, r, r);
      }
    }
  }

  if(q != null) {
    drShiftTo(ys, q, r);

    if (ts != ms) {
      subTo(q,q, BigInteger.ZERO);
    }
  }

  r.t = ys;

  clamp(r);

  if (nsh > 0) {
    rShiftTo(nsh,r, r);  // Denormalize remainder
  }

  if (ts < 0) {
    subTo(r,r, BigInteger.ZERO);
  }
};

function toByteArray(bigInteger) {
  var i = bigInteger.t;
  var r = new Array();
  r[0] = bigInteger.s;
  var p = BITS_PER_DIGIT - (i * BITS_PER_DIGIT) % 8;
  var d = 0;
  var k = 0;

  if(i-- > 0) {
    if (p < BITS_PER_DIGIT && (d = bigInteger[i]>>p) != (bigInteger.s &bigInteger.DM) >> p) {
      r[k++] = d|(bigInteger.s<<(BITS_PER_DIGIT-p));
    }

    while(i >= 0) {
      if(p < 8) {
        d = (bigInteger[i] & ((1 << p) - 1)) << (8 - p);
        d |= bigInteger[--i] >> (p += BITS_PER_DIGIT - 8);
      } else {
        d = (bigInteger[i] >> (p -= 8)) & 0xff;
        if (p <= 0) {
          p += BITS_PER_DIGIT;
          --i;
        }
      }

      if ((d & 0x80) != 0) {
        d |= -256;
      }

      if (k === 0 && (bigInteger.s & 0x80) != (d & 0x80)) {
        ++k;
      } 

      if (k > 0 || d != bigInteger.s) {
        r[k++] = d;
      }
    }
  }
  return r;
}

var BITS_PER_DIGIT = 26;
var BI_FP = 52;
var FV = Math.pow(2, BI_FP);
var DV = (1 << BITS_PER_DIGIT);
var DM = ((1 << BITS_PER_DIGIT) - 1);
var F1 = BI_FP - BITS_PER_DIGIT;
var F2 = 2 * BITS_PER_DIGIT - BI_FP;
var BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz';
var BI_RC = [ ];

function configureDigitConversion() {
  var rr = '0'.charCodeAt(0);
  var vv;

  for (vv = 0; vv <= 9; ++vv) {
    BI_RC[rr++] = vv;
  }

  rr = 'a'.charCodeAt(0);

  for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
  }

  rr = 'A'.charCodeAt(0);

  for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
  }
}

configureDigitConversion();

BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

/**
 * Turns a byte array into a big integer.
 *
 * This function will interpret a byte array as a big integer in big
 * endian notation and ignore leading zeros.
 *
 * @param {number[]} bytes
 * @return {BigInteger}
 */
BigInteger.fromByteArrayUnsigned = function(bytes) {
  if (bytes.length) {
    return new BigInteger(
      bytes[0] & 0x80 ? [0].concat(bytes) : bytes
    );
  } else {
    return new BigInteger(0);
  }
};

BigInteger.valueOf = function(number) {
  return nbv(number);
};

/**
 * @param {string} hex string in hex format
 * @return {BigInteger}
 */
BigInteger.fromHex = function(hex) {
  return new BigInteger(hex, 16);
}

module.exports = BigInteger;