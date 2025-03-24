import { bindable } from 'aurelia';

export class AmpsTable {
    @bindable amps = [];
    @bindable getItem = () => ``;
    @bindable showDetail = () => ``;
    @bindable getItemById: (itemId: string, dataType: string) => any;

    private filters = [
        { value: '', keys: ['name'] },
        { value: '', keys: ['real'] },
        { value: '', keys: ['type'] },
        { value: '', keys: ['irAuthor'] },
        { value: '', keys: ['deviceType'] },
        { value: '', keys: ['addedIn'] },
    ];

    public getDetailForDevice(device: any): any {
        const detailId = device.detailsId || device.id;
        return this.getItemById(detailId, 'details');
    }
}
