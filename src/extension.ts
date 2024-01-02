import * as vscode from 'vscode';
import axios from 'axios';

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
    private data: MyTreeViewItem[] = [];
    private readonly onDidChangeTreeDataEmitter = new vscode.EventEmitter<MyTreeViewItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<MyTreeViewItem | undefined> = this.onDidChangeTreeDataEmitter.event;

    constructor(private readonly context: vscode.ExtensionContext) {
        // Fetch random number from a free API
        this.fetchRandomNumberFromApi().then((randomNumber) => {
            // Generate tree view items based on the random number
            this.data = this.generateTreeViewItems(randomNumber);

            // Refresh the tree view
            this.refresh();
        });
    }

    private async fetchRandomNumberFromApi(): Promise<number> {
        try {
            // Example API URL returning a JSON object with a 'number' property
            const apiUrl = 'https://www.random.org/integers/?num=1&min=1&max=8&col=1&base=10&format=plain&rnd=new'

            // Fetch data from the API
            const response = await axios.get(apiUrl);

            // Parse and return the random number
            const randomNumber = response.data; // Adjust this based on the actual structure of the response
            console.log(randomNumber);
            if (typeof randomNumber === 'number') {
                return randomNumber;
            } else {
                console.error('Invalid random number format in the API response.');
                return 0;
            }
        } catch (error: any) {
            console.error('Error fetching random number from API:', error.message);
            return 0;
        }
    }
    private generateTreeViewItems(count: number): MyTreeViewItem[] {
        const items: MyTreeViewItem[] = [];

        // Top-level items
        const devItem = new MyDevTreeViewItem(this.context, 'dev', vscode.TreeItemCollapsibleState.Expanded, Status.Green, count);

        // Other top-level items
        const perfItem = new MyPerfTreeViewItem(this.context, 'perf', vscode.TreeItemCollapsibleState.Expanded, Status.Green,count);
        const prodItem = new MyProdTreeViewItem(this.context, 'prod', vscode.TreeItemCollapsibleState.Expanded, Status.Green,count);

        // Add top-level items to the list
        items.push(devItem, perfItem, prodItem);

        return items;
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

    refresh(): void {
        this.onDidChangeTreeDataEmitter.fire(undefined);
    }
}


class MyTreeViewItem extends vscode.TreeItem {
    children?: MyTreeViewItem[] | undefined;
    status?: Status | undefined;
    context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext, label: string, collapsibleState: vscode.TreeItemCollapsibleState, status?: Status, children?: MyTreeViewItem[]) {
        super(label, collapsibleState);
        this.context = context;
        this.children = children;
        this.status = status;
        this.updateIcon();
    }

    getChildren(): MyTreeViewItem[] {
        return this.children || [];
    }

    private updateIcon(): void {
        if (this.children && this.children.length > 0) {
            // Display an icon for items with children (top-level items)
            const iconPath = vscode.Uri.file(this.context.asAbsolutePath('resources/top-level-icon.png'));
            this.iconPath = iconPath;
        } else if (this.status === Status.Green) {
            // Display an icon for items with a status (child items)
            const iconPath = vscode.Uri.file(this.context.asAbsolutePath('resources/green-circle.png'));
            this.iconPath = iconPath;
        } else if (this.status === Status.Red) {
            const iconPath = vscode.Uri.file(this.context.asAbsolutePath('resources/red-circle.png'));
            this.iconPath = iconPath;
        }
    }
}

class MyDevTreeViewItem extends MyTreeViewItem {
    constructor(context: vscode.ExtensionContext, label: string, collapsibleState: vscode.TreeItemCollapsibleState, status?: Status, private count: number = 0) {
        super(context, label, collapsibleState, status);
        this.iconPath = undefined;
        this.generateChildren();
    }

    private generateChildren(): void {
        this.children = [];
        for (let i = 1; i <= this.count; i++) {
            const devChild = new MyTreeViewItem(this.context, `dev${i}`, vscode.TreeItemCollapsibleState.None, Status.Green);
            this.children.push(devChild);
        }
    }
    
}

class MyPerfTreeViewItem extends MyTreeViewItem {
    constructor(context: vscode.ExtensionContext, label: string, collapsibleState: vscode.TreeItemCollapsibleState, status?: Status, private count: number = 0) {
        super(context, label, collapsibleState, status);
        this.iconPath = undefined;
        this.generateChildren();
    }

    private generateChildren(): void {
        this.children = [];
        for (let i = 1; i <= this.count; i++) {
            const devChild = new MyTreeViewItem(this.context, `perf${i}`, vscode.TreeItemCollapsibleState.None, Status.Green);
            this.children.push(devChild);
        }
    }
    
}

class MyProdTreeViewItem extends MyTreeViewItem {
    constructor(context: vscode.ExtensionContext, label: string, collapsibleState: vscode.TreeItemCollapsibleState, status?: Status, private count: number = 0) {
        super(context, label, collapsibleState, status);
        this.iconPath = undefined;
        this.generateChildren();
    }

    private generateChildren(): void {
        this.children = [];
        for (let i = 1; i <= this.count; i++) {
            const devChild = new MyTreeViewItem(this.context, `prod${i}`, vscode.TreeItemCollapsibleState.None, Status.Green);
            this.children.push(devChild);
        }
    }
    
}
