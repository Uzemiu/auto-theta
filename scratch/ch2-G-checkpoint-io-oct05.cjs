// Derived solver checkpoints only. No game reads, writes, or search on import.
const fs = require('fs');
const v8 = require('v8');
const CHUNK = 64 * 1024 * 1024;

function writeAtomic(target, buffer, io = fs) {
  if (!Buffer.isBuffer(buffer)) throw new TypeError('checkpoint must be a Buffer');
  const temp = target + '.writing.' + process.pid;
  let fd;
  let calls = 0;
  try {
    fd = io.openSync(temp, 'wx');
    for (let position = 0; position < buffer.length;) {
      // The subarray keeps every write's offset/length below the Node syscall
      // limit even when the entire serialized Buffer exceeds 2 GiB.
      const chunk = buffer.subarray(position, Math.min(position + CHUNK, buffer.length));
      for (let offset = 0; offset < chunk.length;) {
        const part = chunk.subarray(offset);
        const written = io.writeSync(fd, part, 0, part.length, position + offset);
        if (!Number.isInteger(written) || written <= 0 || written > part.length) {
          throw new Error('invalid/zero checkpoint write');
        }
        offset += written;
        calls++;
      }
      position += chunk.length;
    }
    io.fsyncSync(fd);
    io.closeSync(fd);
    fd = undefined;
    // The current file is never opened/truncated before the new file is durable.
    io.renameSync(temp, target);
    return { bytes: buffer.length, calls, chunkLimit: CHUNK };
  } finally {
    if (fd !== undefined) io.closeSync(fd);
    // On failure leave the explicitly named partial temp for diagnosis. Do not
    // delete the prior current file or automatically treat a temp as valid.
  }
}

function readChunked(target, io = fs) {
  const fd = io.openSync(target, 'r');
  try {
    const size = io.fstatSync(fd).size;
    if (!Number.isSafeInteger(size) || size <= 0) throw new Error('empty/invalid checkpoint');
    const buffer = Buffer.allocUnsafe(size);
    for (let position = 0; position < size;) {
      const chunk = buffer.subarray(position, Math.min(position + CHUNK, size));
      for (let offset = 0; offset < chunk.length;) {
        const part = chunk.subarray(offset);
        const read = io.readSync(fd, part, 0, part.length, position + offset);
        if (!Number.isInteger(read) || read <= 0 || read > part.length) {
          throw new Error('truncated checkpoint');
        }
        offset += read;
      }
      position += chunk.length;
    }
    if (io.fstatSync(fd).size !== size) throw new Error('checkpoint changed during read');
    return buffer;
  } finally {
    io.closeSync(fd);
  }
}

function save(target, value) { return writeAtomic(target, v8.serialize(value)); }
function load(target) { return v8.deserialize(readChunked(target)); }
module.exports = { CHUNK, writeAtomic, readChunked, save, load };
