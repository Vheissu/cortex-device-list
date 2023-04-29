import { bindable } from 'aurelia';

export class CapturesTable {
    @bindable captures = [];
    @bindable filters = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;
}
