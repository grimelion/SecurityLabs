'use strict';

const hextob = require('hex-to-binary')

let encodedData =
  "1c41023f564b2a130824570e6b47046b521f3f5208201318245e0e6b40022643072e13183e51183f5a1f3e4702245d4b285a1b23561965133f2413192e571e28564b3f5b0e6b50042643072e4b023f4a4b24554b3f5b0238130425564b3c564b3c5a0727131e38564b245d0732131e3b430e39500a38564b27561f3f5619381f4b385c4b3f5b0e6b580e32401b2a500e6b5a186b5c05274a4b79054a6b67046b540e3f131f235a186b5c052e13192254033f130a3e470426521f22500a275f126b4a043e131c225f076b431924510a295f126b5d0e2e574b3f5c4b3e400e6b400426564b385c193f13042d130c2e5d0e3f5a086b52072c5c192247032613433c5b02285b4b3c5c1920560f6b47032e13092e401f6b5f0a38474b32560a391a476b40022646072a470e2f130a255d0e2a5f0225544b24414b2c410a2f5a0e25474b2f56182856053f1d4b185619225c1e385f1267131c395a1f2e13023f13192254033f13052444476b4a043e131c225f076b5d0e2e574b22474b3f5c4b2f56082243032e414b3f5b0e6b5d0e33474b245d0e6b52186b440e275f456b710e2a414b225d4b265a052f1f4b3f5b0e395689cbaa186b5d046b401b2a500e381d61";

const binaryEncodedData = hextob(ciphered);


const hammingDistance = [];

for (let n = 8; n < ciphered.length / 4; n += 8) {
  let firstChunk = bin.slice(0, n);
  let secondChunk = bin.slice(n, n * 2)

  hammingDistance[n] = {
    n,
    len: 0
  }

  for (let i = 0; i < n; i++) {
    if (firstChunk.charAt(i) != secondChunk.charAt(i)) {
      hammingDistance[n].len++;
    }
  }

  firstChunk = bin.slice(n * 2, n * 3);
  secondChunk = bin.slice(n * 3, n * 4)


  for (let i = 0; i < n; i++) {
    if (firstChunk.charAt(i) != secondChunk.charAt(i)) {
      hammingDistance[n].len++;
    }
  }
  hammingDistance[n].len /= 2
  hammingDistance[n].len /= n;
}

hammingDistance.sort((a, b) => a.len - b.len)

const keysize = hammingDistance[0].n;

const keysizeBytes = keysize / 8;

const scores = {
  'a': 834,
  'b': 154,
  'c': 273,
  'd': 414,
  'e': 1260,
  'f': 203,
  'g': 192,
  'h': 611,
  'i': 671,
  'j': 23,
  'k': 87,
  'l': 424,
  'm': 253,
  'n': 680,
  'o': 770,
  'p': 166,
  'q': 9,
  'r': 568,
  's': 611,
  't': 937,
  'u': 285,
  'v': 106,
  'w': 234,
  'x': 20,
  'y': 204,
  'z': 6,
  ' ': 2320
}

const score = (s) => {
  let string = s.toLowerCase();
  let res = 0;
  for (let i = 0; i < s.length; i++) {
    if (scores[string[i]] !== undefined) {
      res += scores[string[i]];
    }
  }
  return res;
}

const xor = (s, k) => {
  let result = '';
  for (let i = 0; i < s.length; i++) {
    result += String.fromCharCode(s.charCodeAt(i) ^ k);
  }
  return result;
}

const sliceStr = (string, start, step) => {
  let res = '';
  for (let i = start; i < string.length; i += step) {
    res += string[i];
  }
  return res;
}

const hex2a = (hex) => {
  var string = '';
  for (var i = 0; i < hex.length; i += 2)
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return string;
}

const keyBytes = new Array(keysizeBytes);


for (let i = 0; i < keysizeBytes; i++) {
  const slice = sliceStr(hex2a(ciphered), i, keysizeBytes);
  let xored = new Array(256);
  for (let j = 0; j < 256; j++) {
    xored[j] = score(xor(slice, j));
  }
  xored = xored.map((el, i) => ({
    byte: i,
    score: el
  }));
  xored.sort((a, b) => b.score - a.score);

  keyBytes[i] = xored[0].byte;
}

const cypheredAscii = hex2a(ciphered);
let decoded = '';
for (let i = 0; i < cypheredAscii.length;) {
  for (let j = 0; j < keyBytes.length; j++) {
    decoded += xor(cypheredAscii[i], keyBytes[j]);
    i++;
    if (i >= cypheredAscii.length) {
      break;
    }
  }
}

console.log(decoded);