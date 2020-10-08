import { Uri, ViewColumn, WebviewPanel, WebviewView, window } from 'vscode';
import { Template, TemplateEngine } from './utils/template';
import * as path from 'path';
import { CompositeDisposable } from './utils/disposable';
import { Logger } from './utils/logger';

export class ResourceMonitorView extends CompositeDisposable {

    /**
     * The current Resource Monitor View instance(singleton)
     */
    public static currentPanel: ResourceMonitorView | undefined;

    private extensionPath: string;
    private logger: Logger;
    private panel: WebviewPanel | undefined;

    /**
     * 
     * @param extensionPath vscode extension path.
     * @param logger logger instance.
     */
    public static createOrActive(extensionPath: string, logger: Logger) {
        if (ResourceMonitorView.currentPanel) {
            this.currentPanel?.sendMessage({ command: 'load' })
            return;
        } else {
            ResourceMonitorView.currentPanel = new ResourceMonitorView(extensionPath, logger);
        }
    }

    /**
     * Create new ResourceMonitor view instance.
     * @param extensionPath vscode extension path.
     * @param logger logger instance.
     */
    private constructor(extensionPath: string, logger: Logger) {
        super();
        this.extensionPath = extensionPath;
        this.logger = logger;

        const engine = new TemplateEngine(path.join(this.extensionPath,'templates')).load();
        let template = engine.find('monitor.html');
        if (!template) {
            template = new Template("sample", "<html></html>");
        }
        let dependenciesModulePath = Uri.file(path.join(this.extensionPath, './node_modules')).with({scheme: 'vscode-resource'}).toString(true);
        this.panel = window.createWebviewPanel('resource-manager', 'Resource Manager', ViewColumn.One, {
            enableScripts: true
        })
        this.panel.iconPath = Uri.file(path.join(this.extensionPath, './assets/img/chart.png'))
        this.panel.webview.html = template.bind({
            dependencies: dependenciesModulePath,
        });
        this.registDisposable(this.panel.onDidDispose(() => {
            this.panel = undefined;
            this.dispose()
        },
        ));
    }

    private sendMessage(msg: any) {
        if (this.panel) {
            this.panel.webview.postMessage(msg);
        }
    }
}