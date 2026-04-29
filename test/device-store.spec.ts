import { deviceActionHandler, initialDeviceState } from '../src/state/device-store';

describe('device-store', () => {
    afterEach(() => {
        document.body.classList.remove('modal-open');
    });

    it('opens a detail modal by detailsId and locks body scrolling', () => {
        const nextState = deviceActionHandler(initialDeviceState, {
            type: 'showDetails',
            device: { id: 'amp-45', detailsId: 'roland-jc120' },
        });

        expect(nextState.showDetailsModal).toBe(true);
        expect(nextState.currentlySelectedDetail).toEqual(expect.objectContaining({
            id: 'roland-jc120',
            name: 'Roland® JC-120 Jazz Chorus',
        }));
        expect(document.body.classList.contains('modal-open')).toBe(true);
    });

    it('closes the active detail modal and clears the selected detail', () => {
        const openedState = deviceActionHandler(initialDeviceState, {
            type: 'showDetails',
            device: { id: 'amp-45', detailsId: 'roland-jc120' },
        });

        const closedState = deviceActionHandler(openedState, { type: 'closeModal' });

        expect(closedState.showDetailsModal).toBe(false);
        expect(closedState.currentlySelectedDetail).toBeNull();
        expect(document.body.classList.contains('modal-open')).toBe(false);
    });

    it('opens enriched device data even when there is no hand-written detail record', () => {
        const device = {
            id: 'missing-device',
            name: 'Fallback Device',
            description: 'Generated detail text',
            amazonAffiliateLink: 'https://www.amazon.com.au/s?k=Fallback&tag=figurated-22',
        };
        const nextState = deviceActionHandler(initialDeviceState, {
            type: 'showDetails',
            device,
        });

        expect(nextState.showDetailsModal).toBe(true);
        expect(nextState.currentlySelectedDetail).toBe(device);
        expect(document.body.classList.contains('modal-open')).toBe(true);
    });
});
