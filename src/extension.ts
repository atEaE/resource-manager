'use strict'
import { ExtensionContext, window, commands, ViewColumn, Uri, WebviewPanel } from 'vscode';
import * as cpus from './cpus';
import * as path from 'path';
import { Battery, CpuUsage } from './cpus/resources';
import { CommandManager } from './commands';
import { Logger } from './utils/logger';

export function activate(context: ExtensionContext) {
	const logger = new Logger();

	// var resmng = new cpus.StatusBarResourceManager(window.createStatusBarItem(StatusBarAlignment.Left));
	// resmng.StartMonitoring();
	// context.subscriptions.push(resmng);

	// Only allow a single Cat Coder
	let currentPanel: WebviewPanel | undefined = undefined;
	let count = 0;

	const commandManager = new CommandManager(context, logger);
	context.subscriptions.push(commandManager);

	// context.subscriptions.push(
	// 	commands.registerCommand('resource-manager.Start', () => {
	// 		const engine = new TemplateEngine(context.asAbsolutePath('templates')).load();
	// 		var tmp = engine.find('monitor.html');
	// 		if (!tmp) {
	// 			tmp = new Template("sample", "<html></html>");
	// 		}
	
	// 		let dependenciesModulePath = Uri.file(path.join(context.extensionPath, './node_modules'))
	// 								.with({scheme: 'vscode-resource'}).toString(true);

	// 		currentPanel = window.createWebviewPanel(
	// 			'resource-manager',
	// 			'Resource Manager',
	// 			ViewColumn.One,
	// 			{
	// 				enableScripts: true
	// 			}
	// 		);
	// 		currentPanel.iconPath = Uri.file(path.join(context.extensionPath, './assets/img/chart.png'))

	// 		currentPanel.webview.html = tmp.bind({
	// 			dependencies: dependenciesModulePath,
	// 		});
	// 		currentPanel.onDidDispose(
	// 		() => {
	// 			currentPanel = undefined;
	// 		},
	// 		undefined,
	// 		context.subscriptions
	// 		);
	// 	})
	// );

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
