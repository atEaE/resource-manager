'use strict';
import { commands, ExtensionContext } from 'vscode';
import { CompositeDisposable } from "./utils/disposable";
import { Logger } from "./utils/logger";
import { ResourceMonitorView } from './monitorView';

/**
 * A dedicated class for command management
 */
export class CommandManager extends CompositeDisposable {
    private readonly context: ExtensionContext;
    private readonly logger: Logger;
    
    /**
     * Create new Command Manager instance.
     * @param context vscode extesion context.
     * @param logger logger instance.
     */
    constructor(context: ExtensionContext, logger: Logger) {
        super();
        this.context = context;
        this.logger = logger;

        this.registCommand('resource-manager.show', (arg) => this.show(arg));
    }

    /**
     * Register command with Visual Studio Code.
     * @param command A unique identifier for the command.
     * @param callback A command callback handler function.
     */
    private registCommand(command: string, callback: (...any: any[]) => any) {
        this.registDisposable(commands.registerCommand(command, callback));
    }

    /**
     * Display the resource monitor.
     * @param arg any argument
     */
    private show(arg: any) {
        ResourceMonitorView.createOrActive(this.context.extensionPath, this.logger);
    }
}