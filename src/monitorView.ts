import { WebviewPanelSerializer, WebviewPanel, ViewColumn, Uri, window } from 'vscode';
import { Template } from './utils/template';
import * as path from 'path';


export class MonitorPreviewSeriializer implements WebviewPanelSerializer {

    private extensionPath: string;
    private template: Template;
    private preview?: MonitorPreview;

    constructor(extensionPath: string, tempalte: Template) {
        this.extensionPath = extensionPath;
        this.template = tempalte;
    }

    async deserializeWebviewPanel(panel: WebviewPanel, state: any) {
        const column = panel.viewColumn ?? ViewColumn.One;
    }
}

export class MonitorPreview {
    private title: string = "sample";
    private extensionPath: string;
    private uri: Uri;
    private htmlContent: string = '';
    private panel: WebviewPanel;

    constructor(extensionPath: string, uri: Uri, viewColumn: ViewColumn, template: Template, panel?: WebviewPanel) {
        this.extensionPath = extensionPath;
        this.uri = uri;

        let scriptMomentPath = Uri.file(path.join(this.extensionPath, './node_modules/moment/dist'))
                                    .with({scheme: 'vscode-resource'}).toString(true);
        let scriptChartPath = Uri.file(path.join(this.extensionPath, './node_modules/chart.js/dist'))
                                    .with({scheme: 'vscode-resource'}).toString(true);
        let scriptPluginPath = Uri.file(path.join(this.extensionPath, './node_modules/chartjs-plugin-streaming/dist'))
                                    .with({scheme: 'vscode-resource'}).toString(true);
        this.htmlContent = template.bind({
            scriptMoment: scriptMomentPath,
            scriptChart: scriptChartPath,
            scriptPlugin: scriptPluginPath,
        });
        this.panel = this.initWebviewPanel(viewColumn, panel);
    }

    private initWebviewPanel(viewColumn: ViewColumn, panel?: WebviewPanel): WebviewPanel {
        var result = panel;
        if (!result) {
            // create new webview panel
            result = window.createWebviewPanel('resource-manager', this.title, viewColumn);
        }

        return result;
    }

    public configure(): void {
        this.panel.webview.html = this.htmlContent;
    }
}