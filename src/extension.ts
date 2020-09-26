'use strict'
import * as vscode from 'vscode';
import * as cpus from './cpus';

export function activate(context: vscode.ExtensionContext) {
	var resmng = new cpus.StatusBarResourceManager(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left));
	resmng.StartMonitoring();
	context.subscriptions.push(resmng);
}

export function deactivate() {}
