'use strict';
import { Disposable} from 'vscode';

/**
 * Composite disposable class
 */
export class CompositeDisposable implements Disposable {
    private disposables: Disposable[] = [];

    public dispose() {
        this.disposables.forEach(dp => dp.dispose());
        this.disposables = [];
    }

    protected registDisposable(disposable: Disposable) {
        this.disposables.push(disposable);
    }

    protected registDisposables(...disposables: Disposable[]) {
        this.disposables.push(...disposables);
    }
}

/**
 * convert disposable object.
 * @param fn wrap function.
 */
export function toDisposable(fn: () => void): Disposable {
	return {
		dispose: fn
	};
}
