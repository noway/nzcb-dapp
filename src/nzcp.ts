// author: putara
// https://github.com/putara/nzcp/blob/master/verifier.js

type Data = string | number | Uint8Array | Data[] | { [key: string]: Data };

class VerificationError extends Error {
  static invalidData() {
    return "This QR code is invalid.";
  }
}

class Stream {
  data: Uint8Array;
  ptr: number;
  len: number;

  constructor(data: Uint8Array) {
    this.data = data;
    this.ptr = 0;
    this.len = data.length;
  }
  getc() {
    if (this.ptr >= this.len) {
      throw new Error("invalid data");
    }
    return this.data[this.ptr++];
  }
  ungetc() {
    if (this.ptr <= 0) {
      throw new Error("invalid data");
    }
    --this.ptr;
  }
  chop(len: number) {
    if (len < 0) {
      throw new Error("invalid length");
    }
    if (this.ptr + len > this.len) {
      throw new Error("invalid data");
    }
    let out = this.data.subarray(this.ptr, this.ptr + len);
    this.ptr += len;
    return out;
  }
  static fromBase32(input: string) {
    const output = new Uint8Array(Math.ceil((input.length * 5) / 8));
    let buff = 0,
      bits = 0,
      val;
    for (let inp = 0, outp = 0; inp < input.length; inp++) {
      if ((val = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".indexOf(input[inp])) < 0) {
        throw VerificationError.invalidData();
      }
      buff = (buff << 5) | val;
      if ((bits += 5) >= 8) {
        output[outp++] = buff >> (bits -= 8);
      }
    }
    return new Stream(output);
  }
}

// RFC 7049
function decodeCBOR(stream: Stream) {
  function decodeUint(stream: Stream, v: number) {
    let x = v & 31;
    if (x <= 23) {
      // small
    } else if (x === 24) {
      // 8-bit
      x = stream.getc();
    } else if (x === 25) {
      // 16-bit
      x = stream.getc() << 8;
      x |= stream.getc();
    } else if (x === 26) {
      // 32-bit
      x = stream.getc() << 24;
      x |= stream.getc() << 16;
      x |= stream.getc() << 8;
      x |= stream.getc();
    } else if (x === 27) {
      // 64-bit
      x = stream.getc() << 56;
      x |= stream.getc() << 48;
      x |= stream.getc() << 40;
      x |= stream.getc() << 32;
      x |= stream.getc() << 24;
      x |= stream.getc() << 16;
      x |= stream.getc() << 8;
      x |= stream.getc();
    } else {
      throw new Error("invalid data");
    }
    return x;
  }
  function decode(stream: Stream): Data {
    const v = stream.getc();
    const type = v >> 5;
    if (type === 0) {
      // positive int
      return decodeUint(stream, v);
    } else if (type === 1) {
      // negative int
      return ~decodeUint(stream, v);
    } else if (type === 2) {
      // byte array
      return stream.chop(decodeUint(stream, v));
    } else if (type === 3) {
      // utf-8 string
      return new TextDecoder("utf-8").decode(
        stream.chop(decodeUint(stream, v))
      );
    } else if (type === 4) {
      // array
      const d = new Array(decodeUint(stream, v))
        .fill(undefined)
        .map((_) => decode(stream));
      return d;
    } else if (type === 5) {
      // object
      const d: Record<string, Data> = Object.fromEntries(
        new Array(decodeUint(stream, v))
          .fill(undefined)
          .map((_) => [decode(stream), decode(stream)])
      );
      return d;
    }
    // return null
    throw VerificationError.invalidData();
  }
  return decode(stream);
}

// https://nzcp.covid19.health.nz/#data-model
// RFC 8392
function decodeCOSE(stream: Stream) {
  if (stream.getc() !== 0xd2) {
    throw VerificationError.invalidData();
  }
  const data = decodeCBOR(stream);
  if (
    !(data instanceof Array) ||
    data.length !== 4 ||
    !(data[0] instanceof Uint8Array) ||
    typeof data[1] !== "object" ||
    Object.keys(data[1]).length !== 0 ||
    !(data[2] instanceof Uint8Array) ||
    !(data[3] instanceof Uint8Array)
  ) {
    throw VerificationError.invalidData();
  }
  return {
    bodyProtected: data[0],
    payload: data[2],
    signature: data[3],
  };
}

const encodeBytes = (data: Uint8Array | never[]) => {
  const x = data.length;
  if (x === 0) {
    return [0x40];
  } else if (x <= 23) {
    // small
    return [0x40 + x, ...data];
  } else if (x < 256) {
    // 8-bit
    return [0x40 + 24, x, ...data];
  } else if (x < 65536) {
    // 16-bit
    return [0x40 + 25, x >> 8, x & 0xff, ...data];
  } // leave 32-bit and 64-bit unimplemented
  throw new Error("Too big data");
};

export function getToBeSigned(pass: string) {
  const data = decodeCOSE(Stream.fromBase32(pass.substring(8)));
  const sig_structure = new Uint8Array([
    // array w/ 4 items
    0x84,
    // #1: context: "Signature1"
    0x6a,
    0x53,
    0x69,
    0x67,
    0x6e,
    0x61,
    0x74,
    0x75,
    0x72,
    0x65,
    0x31,
    // #2: body_protected: CWT headers
    ...encodeBytes(data.bodyProtected),
    // #3: external_aad: empty
    ...encodeBytes([]),
    // #4: payload: CWT claims
    ...encodeBytes(data.payload),
  ]);
  const ToBeSigned = sig_structure;
  return ToBeSigned;
}

export function getRs(pass: string) {
  const data = decodeCOSE(Stream.fromBase32(pass.substring(8)));
  const r = data.signature.slice(0, 32);
  const s = data.signature.slice(32, 64);
  return [r, s];
}
