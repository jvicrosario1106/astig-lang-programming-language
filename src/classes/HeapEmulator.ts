import { RuntimeValue } from '../models/RuntimeValue';
import { HeapVisualizer } from './HeapVisualizer';

export interface HeapEmulator {
    // Stores a value at a given numeric memory index (address)
    set(address: RuntimeValue, value: RuntimeValue): void;
    // Retrieves a value from a given numeric memory index (address)
    get(address: RuntimeValue): RuntimeValue;
    // Allocates a block of a specific size and returns the starting address index
    malloc(size: number): number;
    // Resizes an allocation block
    realloc(address: number, newSize: number): number;
    // Frees an allocation block
    free(address: number): void;
    // Checks if the space is freed
    isFreed(address: number): boolean

    // Returns the max address of the heap
    getMaxAddress(): number;
    // Returns the heap base address
    getHeapBase(): number;
}

export interface FreeBlock {
    address: number;
    size: number;
}

export class VirtualHeap implements HeapEmulator {
    // Emulated raw address space indexing
    private memory: (RuntimeValue | undefined)[] = [];
    private readonly heapBase = 1000;
    private nextAddress = this.heapBase; // Start at a high index to avoid zero/falsy address collisions

    // Hard architectural ceiling (e.g., max array slots allowed)
    private readonly HEAP_MAX_ADDRESS = 50000;
    
    // Tracks sizes of allocated chunks for realloc/free accounting if needed
    private allocations = new Map<number, number>(); 
    private freedAllocations = new Map<number, number>();

    // Active track of reusable memory gaps
    private freeList: FreeBlock[] = [];

    private isCollecting = false; 
    private gcCallback: (() => void) | null = null;

    private onGarbageCollect?: () => void;
    public registerGCCallback(callback: () => void): void {
        this.gcCallback = callback;
    }

    private getNumericAddress(address: RuntimeValue): number {
        // Unwraps your interpreter's numeric RuntimeValue type (e.g., address.value)
        if (typeof address === 'object' && address !== null && 'value' in address) {
            return Number((address as any).value);
        }
        return Number(address);
    }

    private getMemoryUsage(): number {
        const HEAP_MAX_ADDRESS = 50000;
        let occupiedSlots = 0;

        // Sum up the size of every active allocation block
        for (const size of this.allocations.values()) {
            occupiedSlots += (size + 4); // Account for data size + your 4-slot safety padding
        }

        return occupiedSlots / HEAP_MAX_ADDRESS;
    }

    set(address: RuntimeValue, value: RuntimeValue): void {
        const idx = this.getNumericAddress(address);

        if (this.isFreed(idx)) {
            throw new Error(`Segmentation fault: Attempted write to dangling pointer at address ${idx}`);
        }
        if (idx >= this.HEAP_MAX_ADDRESS) {
            throw new Error(`Segmentation fault: Out of bounds memory write at address ${idx}`);
        }

        this.memory[idx] = value;
    }

    get(address: RuntimeValue): RuntimeValue {
        const idx = this.getNumericAddress(address);
        if (this.isFreed(idx)) {
            throw new Error(`Segmentation fault: Attempted read from dangling pointer at address ${idx}`);
        }
        if (idx >= this.HEAP_MAX_ADDRESS) {
            throw new Error(`Segmentation fault: Out of bounds memory read at address ${idx}`);
        }

        const val = this.memory[idx];
        if (val === undefined) {
            throw new Error(`Segmentation fault: Accessing uninitialized or unallocated memory at address ${idx}`);
        }
        return val;
    }

    malloc(size: number): number {
        const requiredTotal = size + 4; // Allocation + safety padding buffer zone
        
        // Check if memory usage is high AND we aren't already collecting
        if (this.gcCallback && this.getMemoryUsage() >= 0.75 && !this.isCollecting) {
            try {
                this.isCollecting = true;  // Acquire the lock
                this.gcCallback();         // Run the Mark-and-Sweep GC
            } finally {
                this.isCollecting = false; // Always release the lock, even if GC fails
            }
        }

        let allocatedAddr: number;

        // Strategy A: First-Fit Search in the Free List
        for (let i = 0; i < this.freeList.length; i++) {
            const block = this.freeList[i];
            
            // Does this recycled hole fit our size + padding requirements?
            if (block.size >= requiredTotal) {
                allocatedAddr = block.address;

                // Adjust or remove the hole from our free tracking list
                if (block.size === requiredTotal) {
                    this.freeList.splice(i, 1);
                } else {
                    block.address += requiredTotal;
                    block.size -= requiredTotal;
                }

                this.allocations.set(allocatedAddr, size);
                this.freedAllocations.delete(allocatedAddr);

                for (let j = 0; j < size; j++) {
                    this.memory[allocatedAddr + j] = undefined; 
                }

                // -- Visualize the heap --
                let heapLog = HeapVisualizer.renderSnapshot(this, '', allocatedAddr, size);
                //console.log(heapLog);
                HeapVisualizer.appendFullReport(heapLog);
                return allocatedAddr;
            }
        }

        // Strategy B: Fallback to the Bump Frontier (with upper bound verification)
        if (this.nextAddress + requiredTotal > this.HEAP_MAX_ADDRESS) {
            throw new Error(`Runtime Error: Out of Memory. Heap limit of ${this.HEAP_MAX_ADDRESS} bytes exceeded.`);
        }

        allocatedAddr = this.nextAddress;
        this.allocations.set(allocatedAddr, size);
        // Safety step: ensure it's not marked as freed if addresses shift
        //this.freedAllocations.delete(addr);
        
        this.nextAddress += requiredTotal; // Padding to catch simple buffer overruns
        // -- Visualize the heap --
        let heapLog = HeapVisualizer.renderSnapshot(this, '', allocatedAddr, size);
        //console.log(heapLog);
        HeapVisualizer.appendFullReport(heapLog);
        return allocatedAddr;
    }

    free(address: number): void {
        if (this.isFreed(address)) {
            throw new Error(`Double Free Fault: Address ${address} has already been freed.`);
        }

        const size = this.allocations.get(address);
        if (size === undefined) {
            throw new Error(`Invalid Free: Address ${address} was not allocated via malloc.`);
        }

        const totalSizeWithPadding = size + 4;

        // Register the dead address space into the reuse list
        this.freeList.push({ address, size: totalSizeWithPadding });
        // Coalesce continuous free blocks to avoid fragmentation (Optional but recommended)
        this.freeList.sort((a, b) => a.address - b.address);
        
        for (let i = 0; i < size; i++) {
            this.memory[address + i] = undefined;
        }
        this.freedAllocations.set(address, size);
        this.allocations.delete(address);

        for (let i = 0; i < size; i++) {
            this.memory[address + i] = undefined;
        }
    }

    realloc(address: number, newSize: number): number {
        if (this.isFreed(address)) {
            throw new Error(`Segmentation fault: Attempted realloc on dangling pointer at address ${address}`);
        }

        const oldSize = this.allocations.get(address);
        if (oldSize === undefined) return this.malloc(newSize);

        // Simple strategy: allocate new block, copy over elements, free old block
        const newAddr = this.malloc(newSize);
        const copySize = Math.min(oldSize, newSize);
        
        for (let i = 0; i < copySize; i++) {
            this.memory[newAddr + i] = this.memory[address + i];
        }
        
        this.free(address);
        return newAddr;
    }

    isFreed(address: number): boolean {
        // Checks if the given address falls within any block that was freed
        for (const [freedAddr, size] of this.freedAllocations.entries()) {
            // We can't query allocations map directly because the size was deleted[cite: 3]
            // But we know standard padding boundaries or can infer the fault if it hits the base address
            if (address >= freedAddr && address < freedAddr + size) {
                return true;
            }
        }
        return false;
    }

    getMaxAddress(): number { return this.HEAP_MAX_ADDRESS; }
    getHeapBase(): number { return this.heapBase }
}