import { bindable } from 'aurelia';

export class AllTable {
    @bindable all = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;

    public ampCollapsed = false;
    public cabCollapsed = false;
    public effectCollapsed = false;
    public captureCollapsed = false;

    private filters = [
        { value: '', keys: ['name'] },
        { value: '', keys: ['real'] },
        { value: '', keys: ['type'] },
        { value: '', keys: ['irAuthor'] },
        { value: '', keys: ['deviceType'] },
        { value: '', keys: ['addedIn'] },
    ];

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
        }
        
        console.log(`Toggling ${type}:`, this[`${type}Collapsed`]);
    }

    public getDevicesByType(devices: any[], type: string): any[] {
        if (!devices || !Array.isArray(devices)) {
            return [];
        }
        return devices.filter(device => device?.deviceType === type);
    }

    public isSectionCollapsed(type: string): boolean {
        return this[`${type}Collapsed`];
    }
}
