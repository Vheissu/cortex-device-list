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
        { value: '', keys: ['deviceType'] }
    ];

    public getTypeLabelKey(type: string): string {
        return `pluginTypes.${type}`;
    }

    public toggleSection(type: string, event: Event): void {
        event.stopPropagation();
        const collapseProp = `${type}Collapsed`;
        if (this.hasOwnProperty(collapseProp)) {
            this[collapseProp] = !this[collapseProp];
        }
    }

    public getDevicesByType(devices: any[], type: string): any[] {
        if (!devices || !Array.isArray(devices)) {
            return [];
        }
        return devices.filter(device => device?.deviceType === type);
    }
} 
