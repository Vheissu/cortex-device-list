import { bindable } from 'aurelia';

export class AllTable {
    @bindable all = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;

    private filters = [
        { value: '', keys: ['name'] },
        { value: '', keys: ['real'] },
        { value: '', keys: ['type'] },
        { value: '', keys: ['irAuthor'] },
        { value: '', keys: ['deviceType'] },
        { value: '', keys: ['addedIn'] },
    ];
}
