// src/extension.ts
import * as vscode from 'vscode';

enum Status {
    Green = 'green',
    Red = 'red',
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "my-extension" is now active!');
    
     
    // Create a tree view
    const treeDataProvider = new MyTreeViewProvider(context);
    const treeView = vscode.window.createTreeView('myExtensionTreeView', { treeDataProvider });
    

    // Register commands
    let disposable = vscode.commands.registerCommand('extension.showHelloWorld', () => {
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    // This method is called when your extension is deactivated
}

class MyTreeViewProvider implements vscode.TreeDataProvider<MyTreeViewItem> {
    private data: MyTreeViewItem[];

    constructor(private readonly context: vscode.ExtensionContext) {
        this.data = [
            new MyTreeViewItem('dev', vscode.TreeItemCollapsibleState.Collapsed, context, [
                new MyTreeViewItem('dev1', vscode.TreeItemCollapsibleState.None, context, Status.Green),
                new MyTreeViewItem('dev2', vscode.TreeItemCollapsibleState.None, context, Status.Red),
                new MyTreeViewItem('dev3', vscode.TreeItemCollapsibleState.None, context, Status.Green),

            ]),
            // ... (similar structure for 'perf' and 'prod')
        ];
    }

    getTreeItem(element: MyTreeViewItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: MyTreeViewItem): Thenable<MyTreeViewItem[]> {
        if (!element) {
            return Promise.resolve(this.data);
        }
        return Promise.resolve(element.getChildren());
    }
}

/* class MyTreeViewItem extends vscode.TreeItem {
    children?: MyTreeViewItem[] | undefined;
    status?: Status | undefined;

    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, context: vscode.ExtensionContext, statusOrChildren?: Status | MyTreeViewItem[], children?: MyTreeViewItem[]) {
        super(label, collapsibleState);

        if (Array.isArray(statusOrChildren)) {
            this.children = statusOrChildren;
            this.status = undefined;
        } else {
            this.children = children;
            this.status = statusOrChildren;
        }

        this.updateIcon(context);
    }

    getChildren(): MyTreeViewItem[] {
        return this.children || [];
    }

    private updateIcon(context: vscode.ExtensionContext): void {
        if (this.status === Status.Green) {
            this.iconPath = vscode.Uri.file(context.asAbsolutePath('resources/green-circle.svg'));
        } else if (this.status === Status.Red) {
            this.iconPath = vscode.Uri.file(context.asAbsolutePath('resources/red-circle.svg'));
        }
    }
} */
// ...
class MyTreeViewItem extends vscode.TreeItem {
    children?: MyTreeViewItem[] | undefined;
    status?: Status | undefined;

    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, context: vscode.ExtensionContext, statusOrChildren?: Status | MyTreeViewItem[], children?: MyTreeViewItem[]) {
        super(label, collapsibleState);

        if (Array.isArray(statusOrChildren)) {
            this.children = statusOrChildren;
            this.status = undefined;
        } else {
            this.children = children;
            this.status = statusOrChildren;
        }

        this.updateIcon(context);
    }

    getChildren(): MyTreeViewItem[] {
        return this.children || [];
    }

    private updateIcon(context: vscode.ExtensionContext): void {
        if (this.status === Status.Green || this.status === Status.Red) {
            // Assuming only 'green' and 'red' are valid Status values
            this.iconPath = vscode.Uri.file(context.asAbsolutePath(`resources/${this.status}-circle.png`));
        }
    }
}
