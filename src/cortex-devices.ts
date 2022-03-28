import amps from './data/amps.json';
import cabs from './data/cabs.json';
import effects from './data/effects.json';
import captures from './data/captures.json';
import details from './data/details.json';


import AmpsTable from './amps-table.html';
import CabsTable from './cabs-table.html';
import EffectsTable from './effects-table.html';
import CapturesTable from './captures-table.html';

export class CortexDevices {
    private currentTab = 'amps';

    private amps = amps;
    private cabs = cabs;
    private effects = effects;
    private captures = captures;
    private details = details;

    private ampsView = AmpsTable;
    private cabsView = CabsTable;
    private effectsView = EffectsTable;
    private capturesView = CapturesTable;

    private filters = [
        { value: '', keys: ['name'] },
        { value: '', keys: ['real'] },
        { value: '', keys: ['type'] },
        { value: '', keys: ['irAuthor'] },
        { value: '', keys: ['deviceType'] },
    ];

    private showDetailsModal = false;
    private currentlySelectedDetail;

    modalClosed() {
        this.currentlySelectedDetail = null;
        this.showDetailsModal = false;
    }

    triggerShowDetails(device) {
        let deviceId = device.id;

        if (device.detailsId) {
            deviceId = device.detailsId;
        }

        this.currentlySelectedDetail = null;

        const detail = this.getDetail(deviceId);

        if (detail) {
            this.currentlySelectedDetail = detail;
            this.showDetailsModal = true;
        }
    }

    getCab(cabId) {
        return this.cabs.find((c) => c.id === cabId) ?? null;
    }

    getDetail(detailId) {
        return this.details.find((c) => c.id === detailId) ?? null;
    }

    toggleTab(tab) {
        this.currentTab = tab;

        for (const filter of this.filters) {
            filter.value = '';
        }
    }
}
