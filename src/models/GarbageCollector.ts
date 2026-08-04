import { ExecutionContext } from '../interpreter';

export class MarkSweepGC {
    public static run(context: ExecutionContext): void {
        const visited = new Set<number>();
        const heap = context.heap as any; // Access internal structural maps Safely
        
        // --- PHASE 1: MARK ---
        // Gather initial roots from the current environment chain
        const roots = context.environment.collectActiveHeapAddresses();
        
        for (const rootAddress of roots) {
            this.traverse(rootAddress, context, visited);
        }

        // --- PHASE 2: SWEEP ---
        // Collect blocks to delete first so we don't mutate state while evaluating keys
        const deadAddresses: number[] = [];
        const activeAllocations = Array.from(heap.allocations.keys()) as number[];

        for (const address of activeAllocations) {
            // If an allocated block was not reached during the trace, reclaim it!
            if (!visited.has(address)) {
                deadAddresses.push(address);
            }
        }

        // Execute the frees safely outside the iteration loop
        for (const address of deadAddresses) {
            context.heap.free(address);
        }
    }

    private static traverse(address: number, context: ExecutionContext, visited: Set<number>): void {
        // Prevent infinite loops from cyclic references (e.g., self-referencing records)
        if (visited.has(address)) return;
        visited.add(address);

        const heap = context.heap as any;

        try {
            // If this address is the start of a multi-slot allocation block,
            // we must mark the entire block span as visited so internal offsets 
            // aren't treated as dead space by the sweeper or memset tracker.
            if (heap.allocations && heap.allocations.has(address)) {
                const size = heap.allocations.get(address);
                // Standard block size + safety padding (e.g., 4 slots)
                const totalSpan = size + 4; 
                for (let i = 0; i < totalSpan; i++) {
                    visited.add(address + i);
                }
            }

            const value = context.heap.get(address);

            if (typeof value === 'number' && !context.heap.isFreed(value)) {
                this.traverse(value, context, visited);
            } 
            else if (value && typeof value === 'object') {
                if ('isHeapReference' in value) {
                    this.traverse((value as any).address, context, visited);
                } 
                else if (Array.isArray(value)) {
                    for (const element of value) {
                        if (typeof element === 'number') this.traverse(element, context, visited);
                    }
                }
                else if ('fields' in value && value.fields instanceof Map) {
                    for (const fieldValue of value.fields.values()) {
                        if (typeof fieldValue === 'number') this.traverse(fieldValue, context, visited);
                    }
                }
            }
        } catch {
            // Ignore lookups that fail due to raw uninitialized slots
        }
    }
}