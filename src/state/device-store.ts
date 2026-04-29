import { Data } from '../data';

// Helper function to sort arrays alphabetically
function sortArrayOfObjectsAlphabetically(array: any[], key: string): any[] {
    return [...array].sort((a, b) => {
        const nameA = String(a[key] ?? '').toLowerCase();
        const nameB = String(b[key] ?? '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
}

// Initialize sorted data
const sortedData: Record<string, any[]> = {
    amps: [],
    cabs: [],
    effects: [],
    captures: [],
    details: [],
    plugins: [],
    all: []
};

if (Data) {
    for (const key in Data) {
        sortedData[key] = sortArrayOfObjectsAlphabetically(Data[key], 'name');
    }
    sortedData.all = [].concat(
        sortedData.amps,
        sortedData.cabs,
        sortedData.effects,
        sortedData.captures,
        sortedData.plugins
    );
}

// State interface
export interface IDeviceState {
    data: Record<string, any[]>;
    showDetailsModal: boolean;
    currentlySelectedDetail: any;
}

// Initial state
export const initialDeviceState: IDeviceState = {
    data: sortedData,
    showDetailsModal: false,
    currentlySelectedDetail: null
};

// Action types
export type DeviceAction =
    | { type: 'showDetails'; device: any }
    | { type: 'closeModal' }
    | { type: 'getItemById'; itemId: string; dataType: string };

// Action handler
export function deviceActionHandler(state: IDeviceState, action: DeviceAction): IDeviceState {
    switch (action.type) {
        case 'showDetails': {
            const device = action.device;
            const detailId = device.detailsId || device.id;
            const detail = state.data.details.find((d) => d.id === detailId) ?? null;

            if (detail) {
                document.body.classList.add('modal-open');

                return {
                    ...state,
                    currentlySelectedDetail: detail,
                    showDetailsModal: true
                };
            }
            return state;
        }

        case 'closeModal': {
            document.body.classList.remove('modal-open');
            return {
                ...state,
                showDetailsModal: false,
                currentlySelectedDetail: null
            };
        }

        default:
            return state;
    }
}
