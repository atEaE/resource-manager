import { Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import { Template, TemplateEngine } from './utils/template';
import * as path from 'path';
import { CompositeDisposable, toDisposable } from './utils/disposable';
import { Logger } from './utils/logger';
import { CpuUsage, Memory, Resource } from './cpus/resources';


export class ResourceMonitorView extends CompositeDisposable {

    /**
     * The current Resource Monitor View instance(singleton)
     */
    public static currentPanel: ResourceMonitorView | undefined;

    private extensionPath: string;
    private logger: Logger;
    private panel: WebviewPanel | undefined;
    private engine: TemplateEngine;
    private resources: Resource[] = [];

    /**
     * 
     * @param extensionPath vscode extension path.
     * @param logger logger instance.
     */
    public static createOrActive(extensionPath: string, logger: Logger) {
        if (ResourceMonitorView.currentPanel) {
            this.currentPanel?.sendMessage({ command: 'load' });
            return;
        } else {
            ResourceMonitorView.currentPanel = new ResourceMonitorView(extensionPath, logger);
            ResourceMonitorView.currentPanel.setup();
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
        this.engine = new TemplateEngine(path.join(this.extensionPath,'templates')).load();
    }

    /**
     * setup monitorview instance.
     */
    public async setup() {
        let template = this.engine.find('monitor.html');        
        if (!template) {
            template = this.engine.dummy;
            return;
        }

        // create webview.
        this.panel = window.createWebviewPanel('resource-manager', 'Resource Manager', ViewColumn.One, {
            enableScripts: true
        });
        this.panel.iconPath = Uri.file(path.join(this.extensionPath, './assets/img/chart.png'));

        // bind data
        let dependenciesModulePath = Uri.file(path.join(this.extensionPath, './node_modules')).with({scheme: 'vscode-resource'}).toString(true);

        // resource 
        this.resources.push(new CpuUsage());
        let mem = new Memory();
        let memTotal = await mem.total();
        this.panel.webview.html = template.bind({
            dependencies: dependenciesModulePath,
            memTotal: memTotal,
        });
        this.resources.push(mem);

        // regist disposable
        this.registDisposable(this.panel.onDidDispose(() => {
                this.panel = undefined;
                this.dispose();
            },
        ));

        // set callback
        var ids = this.resources.map(r => {
            return setInterval(async () => {
                let status = await r.watch();
                if (!ResourceMonitorView.currentPanel) {
                    return;
                }
                ResourceMonitorView.currentPanel.sendMessage({
                    command: r.name(),
                    status: status,
                });
            }, 1000);
        });

        // regist ids
        ids.forEach(i => {
            this.registDisposable(toDisposable(() => {
                clearInterval(i);
            }));
        });

        // TODO : webview postMessage receiving logic
        // this.registDisposable(this.panel.webview.onDidReceiveMessage((data) => {
        //     console.log(data.value);
        // }))
    }

    public sendMessage(msg: any) {
        if (this.panel) {
            this.panel.webview.postMessage(msg);
        }
    }
}