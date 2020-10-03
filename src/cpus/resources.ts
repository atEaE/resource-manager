'use strict';
import * as si from 'systeminformation'; 

/**
 * CPU Resource interface.
 */
export interface IResource {
    /**
     * Check the status of the CPU resources.
     */
    watch(): Promise<number>;
}

/**
 * Battery resource(Usage)
 */
export class Battery implements IResource {
    /**
     * Check the status of the CPU resources.
     */
    public async watch(): Promise<number> {
        let batteryInfo = await si.battery();
        return Math.min(Math.max(batteryInfo.percent, 0), 100);
    }
}

/**
 * CPU resource(Usage)
 */
export class CpuUsage implements IResource {
    /**
     * Check the status of the CPU resources.
     */
    public async watch(): Promise<number> {
        let currentLoad = await si.currentLoad();
        return 100 - currentLoad.currentload_idle;
    }
}








// export class Battery_old {
//     public async ShowStatusBar(): Promise<string> {
//         let batteryInfo = await si.battery();
//         let remainingPercent = Math.min(Math.max(batteryInfo.percent, 0), 100);
//         return `$(plug) ${remainingPercent}`
//     }
// }