import { AllTable } from '../src/views/all-table';

describe('all-table', () => {
    it('should group effect-style devices with effects', () => {
        const table = new AllTable();
        const devices = [
            { name: 'Amp', deviceType: 'amp' },
            { name: 'Drive', deviceType: 'overdrive' },
            { name: 'Plugin', deviceType: 'amp', requiresPlugin: true },
        ];

        expect(table.getDevicesByType(devices, 'effect')).toEqual([
            { name: 'Drive', deviceType: 'overdrive' },
        ]);
    });
});
