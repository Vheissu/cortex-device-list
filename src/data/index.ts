import amps from './amps.json';
import cabs from './cabs.json';
import effects from './effects.json';
import captures from './captures.json';
import baseDetails from './details.json';
import extraDetails from './details-extra.json';
import gojiraPlugins from './plugins/gojira.json';
import pliniPlugins from './plugins/plini.json';
import namelessPlugins from './plugins/nameless.json';
import slo100Plugins from './plugins/slo-100.json';
import coryWongPlugins from './plugins/cory-wong.json';
import nollyPlugins from './plugins/nolly.json';
import parallaxPlugins from './plugins/parallax.json';
import { enrichDevices } from './enrichment';

const plugins = [...gojiraPlugins, ...pliniPlugins, ...namelessPlugins, ...slo100Plugins, ...coryWongPlugins, ...nollyPlugins, ...parallaxPlugins];
const details = [...baseDetails, ...extraDetails].reduce((items, detail) => {
    const existingIndex = items.findIndex((item) => item.id === detail.id);

    if (existingIndex >= 0) {
        items[existingIndex] = { ...items[existingIndex], ...detail };
    } else {
        items.push(detail);
    }

    return items;
}, []);

export const Data = {
    amps: enrichDevices(amps, details),
    cabs: enrichDevices(cabs, details),
    effects: enrichDevices(effects, details),
    captures: enrichDevices(captures, details),
    details,
    plugins: enrichDevices(plugins, details),
};
