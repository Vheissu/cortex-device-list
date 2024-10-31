import { Data } from './data';
import { Views } from './views';

export class CortexDevices {
    private currentTab = 'all';

    private data = {
        all: [],
        amps: [],
        cabs: [],
        effects: [],
        captures: [],
        details: []
    };

    private views = Views;
    private showDetailsModal = false;
    private currentlySelectedDetail;

    private nav = [
        {
            label: 'All',
            slug: 'all',
        },
        {
            label: 'Amps',
            slug: 'amps',
        },
        {
            label: 'Cabs',
            slug: 'cabs',
        },
        {
            label: 'Effects',
            slug: 'effects',
        },
        {
            label: 'Captures',
            slug: 'captures',
        }
    ];

    constructor() {
        if (Data) {
            for (const key in Data) {
                this.data[key] = this.sortArrayOfObjectsAlphabetically(Data[key], 'name');
            }
        }

        this.data.all = [].concat(...Object.values(this.data));
    }

    sortArrayOfObjectsAlphabetically(array, key) {
        return array.sort((a, b) => {
            const nameA = a[key].toLowerCase();
            const nameB = b[key].toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }

    private handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.showDetailsModal) {
            this.modalClosed();
        }
    }

    attached() {
        document.addEventListener('keydown', this.handleEscKey);
    }

    detached() {
        document.removeEventListener('keydown', this.handleEscKey);
    }

    modalClosed() {
        this.showDetailsModal = false;
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            this.currentlySelectedDetail = null;
        }, 200);
    }

    triggerShowDetails = (device) => {
        const detailId = device.detailsId || device.id;
        const detail = this.data.details.find((d) => d.id === detailId) ?? null;
        if (detail) {
            this.currentlySelectedDetail = detail;
            this.showDetailsModal = true;
            document.body.classList.add('modal-open');
        }
    }

    getItemById = (itemId, dataType) => {
        return this.data[dataType].find((item) => item.id === itemId) ?? null;
    }

    toggleTab(tab) {
        this.currentTab = tab;
    }
}
