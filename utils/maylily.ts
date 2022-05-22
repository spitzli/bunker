import { maylily } from "maylily";

// keeps options until next change
maylily({
  timeBase: Date.parse("2021-08-18T00:00:00Z"),
  machineBits: 4, // if required number machines are up to 2, this is enough.
  machineId: 0,
});

export function generateMaylily() {
  return maylily().then((id) => BigInt(id));
}
