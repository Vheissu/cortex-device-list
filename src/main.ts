import Aurelia from 'aurelia';
import { I18nConfiguration } from '@aurelia/i18n';
import { RouterConfiguration } from '@aurelia/router';
import { StateDefaultConfiguration } from '@aurelia/state';
import { CortexDevices } from './cortex-devices';

import { AureliaTableConfiguration } from 'aurelia2-table';

import 'bootstrap';
import './styles.scss';
import en from './locales/en/translation.json';
import { initialDeviceState, deviceActionHandler } from './state/device-store';

Aurelia
    .register(
        AureliaTableConfiguration,
        RouterConfiguration.customize({
            useHref: false,
        }),
        I18nConfiguration.customize((options) => {
            options.initOptions = {
                resources: {
                    en: {
                        translation: en,
                    },
                },
                lng: 'en',
                fallbackLng: 'en',
            };
        }),
        StateDefaultConfiguration.init(initialDeviceState, deviceActionHandler)
    )
    .app(CortexDevices)
    .start();
