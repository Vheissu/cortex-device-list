import { bindable } from 'aurelia';

export class CabsTable {
    @bindable cabs = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;

    private filters = [
        { value: '', keys: ['name'] },
        { value: '', keys: ['real'] },
        { value: '', keys: ['type'] },
        { value: '', keys: ['irAuthor'] },
        { value: '', keys: ['deviceType'] },
        { value: '', keys: ['addedIn'] },
        { value: '', keys: ['description', 'brand', 'model', 'searchKeywords'] },
    ];
}
