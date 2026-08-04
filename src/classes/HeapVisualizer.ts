import { VirtualHeap } from './HeapEmulator';

export class HeapVisualizer {
    /**
     * Renders a 100-character text bar representing the heap's layout.
     * [■] = Active Allocation  |  [░] = Recycled Free List Gap  |  [.] = Untouched Frontier
     */
    public static render(heap: VirtualHeap, width: number = 100): string {
        const heapMax = 50000; // HEAP_MAX_ADDRESS
        const chars = new Array<string>(width).fill('.');
        
        // Reflect private properties via any-cast safely for debugging visualization
        const internalHeap = heap as any;
        const allocations = internalHeap.allocations; // Map<address, size>[cite: 5]
        const freeList = internalHeap.freeList || []; // FreeBlock[][cite: 5]
        const nextAddress = internalHeap.nextAddress || 1000; // Bump Pointer[cite: 5]

        // 1. Map Active Allocations [■]
        if (allocations) {
            for (const [addr, size] of allocations.entries()) {
                const startIdx = Math.floor((addr / heapMax) * width);
                const endIdx = Math.min(width, Math.ceil(((addr + size + 4) / heapMax) * width));
                for (let i = startIdx; i < endIdx; i++) {
                    chars[i] = '■';
                }
            }
        }

        // 2. Overlay Recycled Holes from Free List [░]
        for (const block of freeList) {
            const startIdx = Math.floor((block.address / heapMax) * width);
            const endIdx = Math.min(width, Math.ceil(((block.address + block.size) / heapMax) * width));
            for (let i = startIdx; i < endIdx; i++) {
                chars[i] = '░';
            }
        }

        // 3. Mark the Bump Pointer Boundary [|]
        const bumpIdx = Math.min(width - 1, Math.floor((nextAddress / heapMax) * width));
        if (chars[bumpIdx] === '.') {
            chars[bumpIdx] = '|';
        }

        // Gather statistical counters[cite: 5]
        const totalAllocated = Array.from(allocations.values() as number[]).reduce((a, b) => a + b + 4, 0);
        const totalFreeGaps = freeList.reduce((acc: number, b: any) => acc + b.size, 0);
        const usagePct = ((totalAllocated / heapMax) * 100).toFixed(1);

        // Build the text layout
        return [
            `╔══ Heap Map (${usagePct}% Used) ════════════════════════════════════════════════════════════════════════╗`,
            `  [${chars.join('')}]`,
            `╚══ Active Data: ${totalAllocated} slots | Recycled Gaps: ${totalFreeGaps} slots | Frontier: Address ${nextAddress} ╝`
        ].join('\n');
    }
}