import { HeapEmulator } from '../classes/HeapEmulator';
import { HeapReference } from '../classes/RuntimeEnvironment';
import { isRecordRuntimeValue, RuntimeValue } from '../models/RuntimeValue';

export function formatRuntimeValue(
  value: RuntimeValue | HeapReference,
  heap: HeapEmulator,
  depth = 0,
): string {
  if (depth > 4) {
    return '...';
  }

  if (typeof value === 'object' && value !== null && 'isHeapReference' in value) {
    const heapValue = heap.get(value.address);
    return `@${value.address} → ${formatRuntimeValue(heapValue, heap, depth + 1)}`;
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => formatRuntimeValue(item, heap, depth + 1));
    return `[${items.join(', ')}]`;
  }

  if (isRecordRuntimeValue(value)) {
    const fields = [...value.fields.entries()]
      .map(
        ([name, fieldValue]) =>
          `${name}=${formatRuntimeValue(fieldValue, heap, depth + 1)}`,
      )
      .join(', ');
    return `{${value.recordTypeName}: ${fields}}`;
  }

  return String(value);
}
