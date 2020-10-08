'use strict'
import { commands, ExtensionContext, Uri, window, ViewColumn } from 'vscode';
import * as path from 'path';
import { CompositeDisposable } from "./utils/disposable";
import { Template, TemplateEngine } from './utils/template';
import { Logger } from "./utils/logger";

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
        let currentPanel;
        const engine = new TemplateEngine(this.context.asAbsolutePath('templates')).load();
        var template = engine.find('monitor.html');
        if (!template) {
            template = new Template("sample", "<html></html>");
        }
        let dependenciesModulePath = Uri.file(path.join(this.context.extensionPath, './node_modules'))
                                        .with({scheme: 'vscode-resource'}).toString(true);

        currentPanel = window.createWebviewPanel(
            'resource-manager',
            'Resource Manager',
            ViewColumn.One,
            {
            enableScripts: true
            }
        );

        currentPanel.iconPath = Uri.file(path.join(this.context.extensionPath, './assets/img/chart.png'))

        currentPanel.webview.html = template.bind({
            dependencies: dependenciesModulePath,
        });

        currentPanel.onDidDispose(
            () => {
                currentPanel = undefined;
            },
            undefined,
            this.context.subscriptions
        );
    }
}