import { IStore } from '@aurelia/state';
import { resolve } from 'aurelia';
import { IDeviceState, DeviceAction } from '../state/device-store';

export class EffectsRoute {
    private readonly store = resolve(IStore) as IStore<IDeviceState, DeviceAction>;

    public get state(): IDeviceState {
        return this.store.getState();
    }

    public triggerShowDetails = (device: any): void => {
        this.store.dispatch({ type: 'showDetails', device });
    };

    public getItemById = (itemId: string, dataType: string): any => {
        return this.state.data[dataType]?.find((item) => item.id === itemId) ?? null;
    };
}
