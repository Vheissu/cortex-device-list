import { bindable } from 'aurelia';

export class AllTable {
    @bindable all = [];
    @bindable filters = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;
}
