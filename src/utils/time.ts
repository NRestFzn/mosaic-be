type TimeSlot = { start: string; end: string };

const toMs = (iso: string) => new Date(iso).getTime();

export const computeFreeSlots = (
  startIso: string,
  endIso: string,
  busy: TimeSlot[],
  minMinutes = 15
) => {
  const startMs = toMs(startIso);
  const endMs = toMs(endIso);
  const minMs = minMinutes * 60 * 1000;

  const sorted = busy
    .map((b) => ({ start: toMs(b.start), end: toMs(b.end) }))
    .filter((b) => b.end > startMs && b.start < endMs)
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const slot of sorted) {
    const last = merged[merged.length - 1];
    if (!last || slot.start > last.end) {
      merged.push({ ...slot });
    } else {
      last.end = Math.max(last.end, slot.end);
    }
  }

  const free: TimeSlot[] = [];
  let cursor = startMs;

  for (const busySlot of merged) {
    const gap = busySlot.start - cursor;
    if (gap >= minMs) {
      free.push({
        start: new Date(cursor).toISOString(),
        end: new Date(busySlot.start).toISOString()
      });
    }
    cursor = Math.max(cursor, busySlot.end);
  }

  if (endMs - cursor >= minMs) {
    free.push({ start: new Date(cursor).toISOString(), end: new Date(endMs).toISOString() });
  }

  return free;
};
