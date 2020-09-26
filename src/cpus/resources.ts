'use strict';
import * as si from 'systeminformation'; 

export class Battery {
    public async ShowStatusBar(): Promise<string> {
        let batteryInfo = await si.battery();
        let remainingPercent = Math.min(Math.max(batteryInfo.percent, 0), 100);
        return `$(plug) ${remainingPercent}`
    }
}
