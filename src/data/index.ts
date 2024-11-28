import amps from './amps.json';
import cabs from './cabs.json';
import effects from './effects.json';
import captures from './captures.json';
import details from './details.json';
import gojiraPlugins from './plugins/gojira.json';
import pliniPlugins from './plugins/plini.json';
import namelessPlugins from './plugins/nameless.json';
import slo100Plugins from './plugins/slo-100.json';

export const Data = {
    amps,
    cabs,
    effects,
    captures,
    details,
    plugins: [...gojiraPlugins, ...pliniPlugins, ...namelessPlugins, ...slo100Plugins],
};
