import { I18N } from '@aurelia/i18n';
import { IStore } from '@aurelia/state';
import { resolve } from 'aurelia';
import { IDeviceState, DeviceAction } from '../state/device-store';

export class AllRoute {
    private readonly i18n: I18N = resolve(I18N);
    private readonly store = resolve(IStore) as IStore<IDeviceState, DeviceAction>;

    private readonly deviceTypeKeyMap: Record<string, string> = {
        amp: 'deviceTypes.amp',
        cab: 'deviceTypes.cab',
        effect: 'deviceTypes.effect',
        capture: 'deviceTypes.capture'
    };

    public get state(): IDeviceState {
        return this.store.getState();
    }

    public triggerShowDetails = (device: any): void => {
        this.store.dispatch({ type: 'showDetails', device });
    };

    public getItemById = (itemId: string, dataType: string): any => {
        return this.state.data[dataType]?.find((item) => item.id === itemId) ?? null;
    };

    public getDeviceTypeLabel(device: any): string {
        const key = this.deviceTypeKeyMap[device?.deviceType];
        if (key) {
            return this.i18n.tr(key);
        }

        return device?.deviceTypeLabel ?? device?.deviceType ?? '';
    }
}
