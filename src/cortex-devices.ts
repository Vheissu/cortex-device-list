import amps from './data/amps.json';
import cabs from './data/cabs.json';
import effects from './data/effects.json';
import captures from './data/captures.json';
import details from './data/details.json';

import AllView from './all-table.html';
import AmpsTable from './amps-table.html';
import CabsTable from './cabs-table.html';
import EffectsTable from './effects-table.html';
import CapturesTable from './captures-table.html';

export class CortexDevices {
    private currentTab = 'amps';

    private amps = this.sortArrayOfObjectsAlphabetically(amps, 'name');
    private cabs = this.sortArrayOfObjectsAlphabetically(cabs, 'name');
    private effects = this.sortArrayOfObjectsAlphabetically(effects, 'name');
    private captures = this.sortArrayOfObjectsAlphabetically(captures, 'name');
    private all  = [...this.amps, ...this.cabs, ...this.effects, ...this.captures];
    private details = details;

    private allView = AllView;
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

    sortArrayOfObjectsAlphabetically(array, key) {
        return array.sort((a, b) => {
            const nameA = a[key].toLowerCase();
            const nameB = b[key].toLowerCase();

            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
    }

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
