import { bindable } from 'aurelia';

export class AmpsTable {
    @bindable amps = [];
    @bindable filters = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;
}
