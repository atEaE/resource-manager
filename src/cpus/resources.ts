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
        return "battery"
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
        return "cpu"
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
    /**
     * Resource identifier name.
     */
    public name(): string {
        return "memory"
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
    public async total() {
        let total = (await si.mem()).total;
        return total / (1024 * 1024 * 1024);
    }
}








// export class Battery_old {
//     public async ShowStatusBar(): Promise<string> {
//         let batteryInfo = await si.battery();
//         let remainingPercent = Math.min(Math.max(batteryInfo.percent, 0), 100);
//         return `$(plug) ${remainingPercent}`
//     }
// }