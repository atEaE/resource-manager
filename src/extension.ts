'use strict'
import { ExtensionContext, StatusBarAlignment, window, commands, ViewColumn, Uri, WebviewPanel } from 'vscode';
import * as cpus from './cpus';
import * as path from 'path';
import { Template, TemplateEngine } from './utils/template';
import { ResourceView } from './view/resourceView';
import * as PubSub from 'pubsub-js';

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
	
			let scriptsPath = Uri.file(path.join(context.extensionPath, './node_modules/chart.js/dist'))
									.with({scheme: 'vscode-resource'}).toString(true);

			currentPanel = window.createWebviewPanel(
			  'catCoding',
			  'Cat Coding',
			  ViewColumn.One,
			  {
				enableScripts: true
			  }
			);
			currentPanel.webview.html = tmp.bind({ scripts: scriptsPath });
			currentPanel.onDidDispose(
			() => {
				currentPanel = undefined;
			},
			undefined,
			context.subscriptions
			);
		})
	);

	// Our new command
	context.subscriptions.push(
		commands.registerCommand('resource-manager.Post', () => {
			setInterval(() => {
				count++;
				if (!currentPanel) {
					return;
				}
				currentPanel.webview.postMessage({ command: 'refactor', counter: count });
			}, 1000);
		})
	  );
}

export function deactivate() {}
