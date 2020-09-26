'use strict';
import { StatusBarItem } from 'vscode';
import * as cpures from './resources'

export class StatusBarResourceManager {
    private statusBar: StatusBarItem;

    constructor(statusBar: StatusBarItem) {
        this.statusBar = statusBar;
        this.statusBar.color = "#FFFFFF";
        this.statusBar.show();
    }

    private resources: cpures.Battery = new cpures.Battery();

    public async StartMonitoring() {
        let updateStatus = this.resources.ShowStatusBar();
        this.statusBar.command = 
        this.statusBar.text = await updateStatus.then(upd => {
            return upd;
        })
    }

    dispose() {

    }
}