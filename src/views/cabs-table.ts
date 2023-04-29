import { bindable } from 'aurelia';

export class CabsTable {
    @bindable cabs = [];
    @bindable filters = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;
}
