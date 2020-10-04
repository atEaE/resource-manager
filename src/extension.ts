'use strict'
import { ExtensionContext, StatusBarAlignment, window, commands, ViewColumn, Uri, WebviewPanel } from 'vscode';
import * as cpus from './cpus';
import * as path from 'path';
import { Template, TemplateEngine } from './utils/template';
import { ResourceView } from './view/resourceView';
import { Battery, CpuUsage } from './cpus/resources';

export function activate(context: ExtensionContext) {
	// var resmng = new cpus.StatusBarResourceManager(window.createStatusBarItem(StatusBarAlignment.Left));
	// resmng.StartMonitoring();
	// context.subscriptions.push(resmng);

	// Only allow a single Cat Coder
	let currentPanel: WebviewPanel | undefined = undefined;
	let count = 0;

	context.subscriptions.push(
		commands.registerCommand('resource-manager.Start', () => {
			const engine = new TemplateEngine(context.asAbsolutePath('templates')).load();
			var tmp = engine.find('monitor.html');
			if (!tmp) {
				tmp = new Template("sample", "<html></html>");
			}
	
			let scriptMomentPath = Uri.file(path.join(context.extensionPath, './node_modules/moment'))
									.with({scheme: 'vscode-resource'}).toString(true);
			let scriptChartPath = Uri.file(path.join(context.extensionPath, './node_modules/chart.js/dist'))
									.with({scheme: 'vscode-resource'}).toString(true);
			let scriptPluginPath = Uri.file(path.join(context.extensionPath, './node_modules/chartjs-plugin-streaming/dist'))
									.with({scheme: 'vscode-resource'}).toString(true);

			let assetsPath = Uri.file(path.join(context.extensionPath, 'assets'))

			currentPanel = window.createWebviewPanel(
			  'catCoding',
			  'Cat Coding',
			  ViewColumn.One,
			  {
				enableScripts: true
			  }
			);
			currentPanel.webview.html = tmp.bind({
				scriptMoment: scriptMomentPath,
				scriptChart: scriptChartPath,
				scriptPlugin: scriptPluginPath,
			});
			currentPanel.onDidDispose(
			() => {
				currentPanel = undefined;
			},
			undefined,
			context.subscriptions
			);
		})
	);

	let cpu = new CpuUsage();
	let battery = new Battery();
	let transition: string[] = [];

	// Our new command
	context.subscriptions.push(
		commands.registerCommand('resource-manager.Post', () => {
			setInterval(async () => {
				let usage = await cpu.watch();
				let batPer = await battery.watch();
				if (!currentPanel) {
					return;
				}
				transition.push(usage.toFixed(2));
				currentPanel.webview.postMessage({
					command: 'refactor',
					cpu: transition,
					battery: batPer.toFixed(2)
				});
			}, 1000);
		})
	  );
}

export function deactivate() {}
