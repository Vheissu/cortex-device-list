import { bindable, BindingMode, CustomAttribute } from 'aurelia';
import { createFixture, setPlatform } from '@aurelia/testing';
import { BrowserPlatform } from '@aurelia/platform-browser';

setPlatform(BrowserPlatform.getOrCreate(globalThis));

export const TranslationAttribute = CustomAttribute.define('t', class {
    public value: unknown;
});

export const AureliaTableAttribute = CustomAttribute.define('aurelia-table', class {
    @bindable public data: unknown[] = [];
    @bindable({ mode: BindingMode.twoWay }) public displayData: unknown[] = [];
    @bindable public filters: unknown[] = [];

    public bound(): void {
        this.displayData = this.data;
    }

    public dataChanged(): void {
        this.displayData = this.data;
    }
});

export const AutSortAttribute = CustomAttribute.define('aut-sort', class {
    @bindable public key = '';
    @bindable public default = '';
});

export async function flush(): Promise<void> {
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
}

export function click(element: Element): void {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

export function normaliseText(element: Element | DocumentFragment | null): string {
    return element?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

export async function renderFixture<T extends object>(
    template: string,
    component: new () => T,
    deps: readonly unknown[] = []
) {
    const fixture = await createFixture(template, component, [
        TranslationAttribute,
        AureliaTableAttribute,
        AutSortAttribute,
        ...deps,
    ]);

    await fixture.startPromise;
    await flush();

    return fixture;
}
