import { RuntimeValue } from '../models/RuntimeValue';

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
}

export class VirtualHeap implements HeapEmulator {
    // Emulated raw address space indexing
    private memory: (RuntimeValue | undefined)[] = [];
    private nextAddress = 1000; // Start at a high index to avoid zero/falsy address collisions
    
    // Tracks sizes of allocated chunks for realloc/free accounting if needed
    private allocations = new Map<number, number>(); 
    private freedAddresses = new Set<number>();

    private getNumericAddress(address: RuntimeValue): number {
        // Unwraps your interpreter's numeric RuntimeValue type (e.g., address.value)
        if (typeof address === 'object' && address !== null && 'value' in address) {
            return Number((address as any).value);
        }
        return Number(address);
    }

    set(address: RuntimeValue, value: RuntimeValue): void {
        const idx = this.getNumericAddress(address);

        if (this.isFreed(idx)) {
            throw new Error(`Segmentation fault: Attempted write to dangling pointer at address ${idx}`);
        }

        this.memory[idx] = value;
    }

    get(address: RuntimeValue): RuntimeValue {
        const idx = this.getNumericAddress(address);

        if (this.isFreed(idx)) {
            throw new Error(`Segmentation fault: Attempted read from dangling pointer at address ${idx}`);
        }

        const val = this.memory[idx];

        if (val === undefined) {
            throw new Error(`Segmentation fault: Accessing uninitialized or unallocated memory at address ${idx}`);
        }
        return val;
    }

    malloc(size: number): number {
        const addr = this.nextAddress;
        this.allocations.set(addr, size);
        
        // Safety step: ensure it's not marked as freed if addresses shift[cite: 3]
        this.freedAddresses.delete(addr);

        // Reserve slots in our virtual array space
        for (let i = 0; i < size; i++) {
            this.memory[addr + i] = null; // or a default uninitialized RuntimeValue literal
        }
        
        this.nextAddress += size + 4; // Padding to catch simple buffer overruns
        return addr;
    }

    free(address: number): void {
        const size = this.allocations.get(address);
        if (size === undefined) {
            throw new Error(`Invalid Free: Address ${address} was not allocated via malloc.`);
        }
        
        for (let i = 0; i < size; i++) {
            this.memory[address + i] = undefined;
        }
        this.freedAddresses.add(address);
        this.allocations.delete(address);
    }

    realloc(address: number, newSize: number): number {
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
        for (const freedAddr of this.freedAddresses) {
            // We can't query allocations map directly because the size was deleted[cite: 3]
            // But we know standard padding boundaries or can infer the fault if it hits the base address
            if (address === freedAddr) {
                return true;
            }
        }
        return false;
    }
}