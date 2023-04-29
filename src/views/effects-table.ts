import { bindable } from 'aurelia';

export class EffectsTable {
    @bindable effects = [];
    @bindable filters = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;
}
