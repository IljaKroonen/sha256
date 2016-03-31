import * as stringBlockToUint32Array from './string-block-to-uint32-array';
import * as messageAppend from './message-append';
import * as uint32ArrayToHexString from './uint32-array-to-hex-string';
import * as operators from './operators';
import * as compression from './compression';
import * as sha256 from './sha256';

stringBlockToUint32Array.test();
messageAppend.test();
uint32ArrayToHexString.test();
operators.test();
compression.test();
sha256.test();