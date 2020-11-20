'use strict';
import * as si from 'systeminformation'; 
import { Disposable } from 'vscode';

/**
 * CPU Resource interface.
 */
export interface Resource extends Disposable {
    /**
     * Resource identifier name.
     */
    name(): string;

    /**
     * Check the status of the CPU resources.
     */
    watch(): Promise<number>;
}

/**
 * Battery resource(Usage)
 */
export class Battery implements Resource {
    /**
     * Resource identifier name.
     */
    public name(): string {
        return "battery";
    }

    /**
     * Check the status of the CPU resources.
     */
    public async watch(): Promise<number> {
        let batteryInfo = await si.battery();
        return Math.min(Math.max(batteryInfo.percent, 0), 100);
    }

    /**
     * Release the resource.
     */
    public dispose() {}
}

/**
 * CPU resource(Usage)
 */
export class CpuUsage implements Resource {
    /**
     * Resource identifier name.
     */
    public name(): string {
        return "cpu";
    }

    /**
     * Check the status of the CPU resources.
     */
    public async watch(): Promise<number> {
        let currentLoad = await si.currentLoad();
        return 100 - currentLoad.currentload_idle;
    }

    /**
     * Release the resource.
     */
    public dispose() {}
}

export class Memory implements Resource {
    private totalSize: number = 0;

    /**
     * Resource identifier name.
     */
    public name(): string {
        return "memory";
    }

    /**
     * Resource setup
     */
    public async setup(): Promise<Memory> {
        this.totalSize = (await si.mem()).total;
        return this;
    }
    
    /**
     * Check the status of the Memory resources.
     */
    public async watch(): Promise<number> {
        let memInfo = await si.mem();
        return memInfo.active / (1024 * 1024 * 1024);
    }

    /**
     * Release the resource.
     */
    public dispose() {}

    /**
     * memory total
     */
    public total(): number {
        return this.totalSize / (1024 * 1024 * 1024);
    }
}

export class Disk implements Resource {
    private totalSize: number = 0;
    private remainSize: number = 0;
    private useSize: number = 0;

    /**
     * Resource identifier name.
     */
    public name(): string {
        return "disk";
    }

    /**
     * Resource setup
     */
    public async setup(): Promise<Disk> {
        let fsInfos = await si.fsSize();
        this.totalSize = fsInfos[0].size;
        this.useSize = fsInfos[0].used;
        this.remainSize = this.totalSize - this.useSize;
        return this;
    }
    
    /**
     * Check the status of the Memory resources.
     */
    public async watch(): Promise<number> {
        let fsInfos = await si.fsSize();
        return fsInfos[0].use;
    }

    /**
     * Release the resource.
     */
    public dispose() {}

    /**
     * Disk remaining size;
     */
    public remainingSize(): number {
        return this.remainSize / (1000 * 1000 * 1000);
    }

    /**
     *Disk usage size;
     */
    public usageSize(): number {
        return this.useSize / (1000 * 1000 * 1000);
    }
}








// export class Battery_old {
//     public async ShowStatusBar(): Promise<string> {
//         let batteryInfo = await si.battery();
//         let remainingPercent = Math.min(Math.max(batteryInfo.percent, 0), 100);
//         return `$(plug) ${remainingPercent}`
//     }
// }