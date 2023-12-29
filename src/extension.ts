// src/extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "wf-harness" is now active!');

    // Create a tree view
    const treeDataProvider = new MyTreeViewProvider();
    const treeView = vscode.window.createTreeView('myExtensionTreeView', { treeDataProvider });

    // Register commands
    let disposable = vscode.commands.registerCommand('extension.showHelloWorld', () => {
        vscode.window.showInformationMessage('Hello Harness!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    // This method is called when your extension is deactivated
}

class MyTreeViewProvider implements vscode.TreeDataProvider<MyTreeViewItem> {
    getTreeItem(element: MyTreeViewItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: MyTreeViewItem): Thenable<MyTreeViewItem[]> {
        const items: MyTreeViewItem[] = [
            new MyTreeViewItem('Show Hello World', vscode.TreeItemCollapsibleState.None, {
                command: 'extension.showHelloWorld',
                title: 'Show Hello World'
            })
        ];

        return Promise.resolve(items);
    }
}

class MyTreeViewItem extends vscode.TreeItem {
    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, command?: vscode.Command) {
        super(label, collapsibleState);
        this.command = command;
    }
}
