import { bindable } from 'aurelia';

export class AllTable {
    @bindable all = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;
    @bindable getItemById: (itemId: string, dataType: string) => any;

    public ampCollapsed = false;
    public cabCollapsed = false;
    public effectCollapsed = false;
    public captureCollapsed = false;
    public pluginsCollapsed = false;

    private filters = [
        { value: '', keys: ['name'] },
        { value: '', keys: ['real'] },
        { value: '', keys: ['deviceType'] },
        { value: '', keys: ['irAuthor'] },
        { value: '', keys: ['deviceType'] },
        { value: '', keys: ['addedIn'] },
    ];

    public $displayDataChanged(newValue: any[]): void {
        if (!newValue) return;

        const hasActiveFilters = this.filters.some(filter => filter.value !== '');
        
        if (hasActiveFilters) {
            this.ampCollapsed = !this.getDevicesByType(newValue, 'amp').length;
            this.cabCollapsed = !this.getDevicesByType(newValue, 'cab').length;
            this.effectCollapsed = !this.getDevicesByType(newValue, 'effect').length;
            this.captureCollapsed = !this.getDevicesByType(newValue, 'capture').length;
            this.pluginsCollapsed = !this.getPluginDevices(newValue).length;
        } else {
            this.ampCollapsed = false;
            this.cabCollapsed = false;
            this.effectCollapsed = false;
            this.captureCollapsed = false;
            this.pluginsCollapsed = false;
        }
    }

    public toggleSection(type: string, event: Event): void {
        event.stopPropagation();
        
        switch(type) {
            case 'amp':
                this.ampCollapsed = !this.ampCollapsed;
                break;
            case 'cab':
                this.cabCollapsed = !this.cabCollapsed;
                break;
            case 'effect':
                this.effectCollapsed = !this.effectCollapsed;
                break;
            case 'capture':
                this.captureCollapsed = !this.captureCollapsed;
                break;
            case 'plugins':
                this.pluginsCollapsed = !this.pluginsCollapsed;
                break;
        }
        
        console.log(`Toggling ${type}:`, this[`${type}Collapsed`]);
    }

    public getPluginDevices(devices: any[]): any[] {
        if (!devices || !Array.isArray(devices)) {
            return [];
        }
        console.log(devices.filter(device => device?.requiresPlugin === true));
        return devices.filter(device => device?.requiresPlugin === true);
    }

    public getDevicesByType(devices: any[], type: string): any[] {
        if (!devices || !Array.isArray(devices)) {
            return [];
        }

        devices = devices.filter(device => !device?.requiresPlugin);

        const effectTypes = ['modulation', 'eq', 'morph', 'overdrive', 'compressor', 'utility', 'delay', 'reverb', 'pitch', 'octaver', 'wow', 'drive', 'pre-delay'];

        if (type === 'effect') {
            return devices.filter(device => effectTypes.includes(device?.deviceType));
        }

        return devices.filter(device => device?.deviceType === type);
    }

    public isSectionCollapsed(type: string): boolean {
        return this[`${type}Collapsed`];
    }

    public getDetailForDevice(device: any): any {
        const detailId = device.detailsId || device.id;
        return this.getItemById(detailId, 'details');
    }
}
