import { bindable } from 'aurelia';

export class PluginsTable {
    @bindable plugins = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;

    public pitchCollapsed = false;
    public overdriveCollapsed = false;
    public modulationCollapsed = false;
    public amplifierCollapsed = false;
    public cabinetCollapsed = false;
    public delayCollapsed = false;
    public reverbCollapsed = false;
    public compressorCollapsed = false;

    private filters = [
        { value: '', keys: ['name'] },
        { value: '', keys: ['real'] },
        { value: '', keys: ['deviceType'] },
        { value: '', keys: ['description', 'brand', 'model', 'searchKeywords'] },
    ];

    public getTypeLabelKey(type: string): string {
        return `pluginTypes.${type}`;
    }

    public toggleSection(type: string, event: Event): void {
        event.stopPropagation();
        if (type === 'amp') {
            this.amplifierCollapsed = !this.amplifierCollapsed;
            return;
        }

        if (type === 'cab') {
            this.cabinetCollapsed = !this.cabinetCollapsed;
            return;
        }

        const collapseProp = `${type}Collapsed`;
        if (Object.prototype.hasOwnProperty.call(this, collapseProp)) {
            this[collapseProp] = !this[collapseProp];
        }
    }

    public getDevicesByType(devices: any[], type: string): any[] {
        if (!devices || !Array.isArray(devices)) {
            return [];
        }
        return devices.filter(device => device?.deviceType === type);
    }

    public isCollapsed(type: string): boolean {
        if (type === 'amp') {
            return this.amplifierCollapsed;
        }

        if (type === 'cab') {
            return this.cabinetCollapsed;
        }

        return this[`${type}Collapsed`] === true;
    }
} 
