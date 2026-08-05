import { VirtualHeap } from './HeapEmulator';

export class HeapVisualizer {
    private static stepCount = 0;
    private static fullReport = "";
    
    /**
     * Renders a 100-character text bar representing the heap's layout.
     * [■] = Active Allocation  |  [░] = Recycled Free List Gap  |  [.] = Untouched Frontier
     */
    public static renderSnapshot(
        heap: VirtualHeap, 
        context: string = '',
        latestAllocAddr?: number, 
        latestAllocSize?: number,
        width: number = 100, 
    ): string {
        // Initial step and date-time config
        this.stepCount++;
        const now = new Date();
        const timestamp = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

        // Reflect private properties via any-cast safely for debugging visualization
        const internalHeap = heap as any;
        const heapMax = internalHeap.getMaxAddress(); // HEAP_MAX_ADDRESS
        const heapBase = internalHeap.getHeapBase();
        const usableCapacity = heapMax - heapBase;

        const allocations = internalHeap.allocations; // Map<address, size>
        const freeList = internalHeap.freeList || []; // FreeBlock[]
        const nextAddress = internalHeap.nextAddress || 1000; // Bump Pointer

        // Fill the array depending on the width
        const chars = new Array<string>(width).fill('.');

        // Map Active Allocations [█]
        if (allocations) {
            for (const [addr, size] of allocations.entries()) {
                const relativeAddr = addr - heapBase;
                const startIdx = Math.floor((relativeAddr / heapMax) * width);
                const endIdx = Math.min(width, Math.ceil(((relativeAddr + size + 4) / usableCapacity) * width));
                for (let i = startIdx; i < endIdx; i++) {
                    chars[i] = '█';
                }
            }
        }

        // Overlay Recycled Holes from Free List [░]
        for (const block of freeList) {
            const relativeAddr = block.address - heapBase;
            const startIdx = Math.floor((relativeAddr / heapMax) * width);
            const endIdx = Math.min(width, Math.ceil(((relativeAddr + block.size) / usableCapacity) * width));
            for (let i = startIdx; i < endIdx; i++) {
                chars[i] = '░';
            }
        }

        // Highlight the latest malloc position if passed [!]
        if (latestAllocAddr !== undefined) {
            const relativeAddr = latestAllocAddr - heapBase;
            const latestIdx = Math.floor((relativeAddr / usableCapacity) * width);
            if (latestIdx >= 0 && latestIdx < width) chars[latestIdx] = '!';
        }

        // Gather statistical counters
        const totalAllocated = Array.from(allocations.values() as number[]).reduce((sum, size) => sum + size + 4, 0);
        const totalFreeGaps = freeList.reduce((acc: number, block: any) => acc + block.size, 0);
        const usagePct = ((totalAllocated / heapMax) * 100).toFixed(1);

        const allocInfo = (latestAllocAddr !== undefined && latestAllocSize !== undefined)
            ? `Allocated: ${latestAllocSize} bytes (+4 pad) @ Address: ${latestAllocAddr}\n`
            : '';

        const contextHeader = context.length > 0 ? `${context}\n` : '';
        
        const lines = [
            `${contextHeader}──────────────────────────────────────────────────────────────────────────────────────────`,
            `[STEP ${String(this.stepCount).padStart(4, '0')} | ${timestamp}]  MALLOC TRIGGERED`,
            allocInfo + `Memory Status: ${totalAllocated}/${heapMax} slots used (${usagePct}%) | Free List: ${freeList.length} gaps (${totalFreeGaps} slots)`,
            ` MAP: [${chars.join('')}]`,
            ` LEGEND: ! Latest Malloc | █ Active Block | ▒ Recycled Gap | . Unused Heap Space`,
            `──────────────────────────────────────────────────────────────────────────────────────────\n`
        ];

        // Build the text layout
        return lines.join('\n');
    }

    public static appendFullReport(snapshot: string) {
        this.fullReport += snapshot + `\n`;
    }

    public static getFullReport() { return this.fullReport; }
}