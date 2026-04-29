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

    it('leaves state unchanged when a device has no matching detail record', () => {
        const nextState = deviceActionHandler(initialDeviceState, {
            type: 'showDetails',
            device: { id: 'missing-device' },
        });

        expect(nextState).toBe(initialDeviceState);
        expect(document.body.classList.contains('modal-open')).toBe(false);
    });
});
