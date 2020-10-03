'use strict'
import * as fs from 'fs';
import * as path from 'path';

export class TemplateEngine {
    /**
     * Template folder to inspect.
     */
    private templateFolder: string;

    /**
     * Template instances.
     */
    private templates: Array<Template> = [];

    /**
     * Create new TemplateEngine instance.
     * @param templateFolder Template folder to inspect.
     */
    constructor (templateFolder: string) {
        this.templateFolder = templateFolder;
    }

    /**
     * Load .html templates from the specified template folder.
     */
    public load(): TemplateEngine {
        const files = fs.readdirSync(this.templateFolder).filter(fn => fn.endsWith('.html'));
        files.forEach(fn => {
            this.templates.push(new Template(fn, fs.readFileSync(path.join(this.templateFolder, fn), 'utf8')));
        });
        return this;
    }

    /**
     * Gets file template with the specified name.
     * @param name Template name.
     */
    public find(name: string): Template | undefined {
        return this.templates.find(t => t.name === name)
    }
}

/**
 * Template class for loading the contents of a template file.
 */
export class Template {
    /**
     * Template name.
     */
    public name: string;

    /**
     * Template file content.
     */
    public content: string;

    /**
     * Create new Template instance.
     * @param name Template name.
     * @param content Template file content.
     */
    constructor(name: string, content: string) {
        this.name = name;
        this.content = content;
    }

    /**
     * Binds template content params by replacing {} tokens with regex.
     * @param bindParams Template key/value pair params.
     */
    public bind(bindParams: any): string {
        let cnts = this.content;
        Object.keys(bindParams).map(bKey => {
            cnts = cnts.replace(RegExp(`{${bKey}}`, 'g'), bindParams[bKey]);
        });
        return cnts;
    }
}