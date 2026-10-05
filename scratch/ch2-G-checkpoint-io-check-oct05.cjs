// Small storage check only. No solver expansion or game interaction.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const v8 = require('v8');
const { CHUNK, writeAtomic, readChunked } = require('./ch2-G-checkpoint-io-oct05.cjs');
function run() {
  const target = path.resolve('artifacts/solver-frontiers/.checkpoint-io-test-' + process.pid + '.v8');
  const temp = target + '.writing.' + process.pid;
  const old = Buffer.from('prior-complete-checkpoint');
  try {
    fs.writeFileSync(target, old);
    const data = Buffer.alloc(CHUNK + 257, 37);
    data[CHUNK - 1] = 51;
    data[CHUNK] = 73;
    data[data.length - 1] = 91;
    const value = { marker: 'roundtrip', q: [{ parent: -1, depth: 0 }], data };
    const serialized = v8.serialize(value);
    let partialCalls = 0;
    const partial = Object.create(fs);
    partial.writeSync = (fd, buffer, offset, length, position) => {
      assert.equal(offset, 0);
      assert.ok(length <= CHUNK);
      partialCalls++;
      return fs.writeSync(fd, buffer, offset, Math.min(length, 1024 * 1024), position);
    };
    const saved = writeAtomic(target, serialized, partial);
    const decoded = v8.deserialize(readChunked(target));
    assert.deepEqual(decoded, value);
    assert.ok(saved.calls > 2 && partialCalls === saved.calls);
    const complete = fs.readFileSync(target);
    const fail = Object.create(fs);
    let attempted = 0;
    fail.writeSync = (fd, buffer, offset, length, position) => {
      if (attempted++) throw new Error('injected write failure');
      return fs.writeSync(fd, buffer, offset, Math.min(length, 13), position);
    };
    assert.throws(() => writeAtomic(target, Buffer.alloc(100), fail), /injected write failure/);
    assert.deepEqual(fs.readFileSync(target), complete);
    assert.equal(fs.statSync(temp).size, 13);
    return { allMatch: true, roundtripBytes: serialized.length, partialWriteCalls: saved.calls,
      chunkLimit: CHUNK, replacementVerified: true, failurePreservedCurrent: true,
      scope: '64 MiB + 257 byte payload, partial writes, atomic replacement and failure; no multi-GiB solver run' };
  } finally {
    // Only these exact test-owned files are removed, never the solver current.
    for (const file of [temp, target]) if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}
if (require.main === module) console.log(JSON.stringify(run()));
module.exports = { run };
