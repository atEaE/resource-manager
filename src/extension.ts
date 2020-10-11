'use strict';
import { ExtensionContext } from 'vscode';
import { CommandManager } from './commands';
import { Logger } from './utils/logger';

export function activate(context: ExtensionContext) {
	const logger = new Logger();
	const commandManager = new CommandManager(context, logger);

	context.subscriptions.push(commandManager);
}

export function deactivate() {}
