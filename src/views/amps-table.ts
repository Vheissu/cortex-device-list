import { bindable } from 'aurelia';

export class AmpsTable {
    @bindable amps = [];
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
