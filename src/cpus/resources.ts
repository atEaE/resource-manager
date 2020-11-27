'use strict';
import * as si from 'systeminformation'; 
import { Disposable } from 'vscode';
import { ResourceMonitorView } from '../monitorView';

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
    update(view: ResourceMonitorView | undefined): void;
}

/**
 * Battery resource(Usage)
 */
export class Battery implements Resource {
    /**
     * timeout id.
     */
    private intervalId?: NodeJS.Timeout

    /**
     * Resource identifier name.
     */
    public name(): string {
        return "battery";
    }

    /**
     * Check the status of the CPU resources.
     */
    public update(view: ResourceMonitorView | undefined): void {
        this.intervalId = setInterval(async () => {
            if (!view) {
                return;
            }

            let batteryInfo = await si.battery();
            view.sendMessage({
                command: this.name(),
                status: Math.min(Math.max(batteryInfo.percent, 0), 100),
            })
        }, 1000);
    }

    /**
     * Release the resource.
     */
    public dispose() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }
}

/**
 * CPU resource(Usage)
 */
export class CpuUsage implements Resource {
    /**
     * timeout id.
     */
    private intervalId?: NodeJS.Timeout

    /**
     * Resource identifier name.
     */
    public name(): string {
        return "cpu";
    }

    /**
     * Check the status of the CPU resources.
     */
    public update(view: ResourceMonitorView | undefined): void {
        this.intervalId = setInterval(async () => {
            if (!view) {
                return;
            }

            let currentLoad = await si.currentLoad();
            view.sendMessage({
                command: this.name(),
                status: 100 - currentLoad.currentload_idle,
            })
        }, 1000);
    }

    /**
     * Release the resource.
     */
    public dispose() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }
}

export class Memory implements Resource {
    /**
     * timeout id.
     */
    private intervalId?: NodeJS.Timeout

    /**
     * Total memory size.
     */
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
    public update(view: ResourceMonitorView | undefined): void {
        this.intervalId = setInterval(async () => {
            if (!view) {
                return;
            }

            let memInfo = await si.mem();
            view.sendMessage({
                command: this.name(),
                status: memInfo.active / (1024 * 1024 * 1024),
            })
        }, 1000);
    }

    /**
     * Release the resource.
     */
    public dispose() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

    /**
     * memory total
     */
    public total(): number {
        return this.totalSize / (1024 * 1024 * 1024);
    }
}

export class Disk implements Resource {
    /**
     * timeout id.
     */
    private intervalId?: NodeJS.Timeout

    /**
     * Disk total size.
     */
    private totalSize: number = 0;

    /**
     * Disk remain size.
     */
    private remainSize: number = 0;

    /**
     * Disk use size.
     */
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
    public update(view: ResourceMonitorView | undefined): void {
        this.intervalId = setInterval(async () => {
            if (!view) {
                return;
            }

            let fsInfos = await si.fsSize();
            view.sendMessage({
                command: this.name(),
                status: fsInfos[0].use,
            })
        }, 1000);
    }

    /**
     * Release the resource.
     */
    public dispose() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

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

export class Process implements Resource {
    /**
     * timeout id.
     */
    private intervalId?: NodeJS.Timeout

    /**
     * Resource identifier name.
     */
    public name(): string {
        return "process";
    }

    /**
     * Check the status of the Memory resources.
     */
    public update(view: ResourceMonitorView | undefined): void {
        this.intervalId = setInterval(async () => {
            if (!view) {
                return;
            }

            let processes = await si.processes();
            view.sendMessage({
                command: this.name(),
                processes: processes.list.filter(p => p.pcpu > 0).slice(0, 20),
            })
        }, 5000);
    }

    /**
     * Release the resource.
     */
    public dispose() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }
}