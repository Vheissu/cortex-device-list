import { route } from '@aurelia/router';
import { IStore } from '@aurelia/state';
import { resolve } from 'aurelia';
import { AllRoute } from './routes/all-route';
import { AmpsRoute } from './routes/amps-route';
import { CabsRoute } from './routes/cabs-route';
import { CapturesRoute } from './routes/captures-route';
import { EffectsRoute } from './routes/effects-route';
import { PluginsRoute } from './routes/plugins-route';
import { IDeviceState, DeviceAction } from './state/device-store';

@route({
    title: 'Quad Cortex',
    routes: [
        {
            id: 'all',
            path: ['', 'all'],
            component: AllRoute,
            title: 'All',
        },
        {
            id: 'amps',
            path: 'amps',
            component: AmpsRoute,
            title: 'Amps',
        },
        {
            id: 'cabs',
            path: 'cabs',
            component: CabsRoute,
            title: 'Cabs',
        },
        {
            id: 'effects',
            path: 'effects',
            component: EffectsRoute,
            title: 'Effects',
        },
        {
            id: 'captures',
            path: 'captures',
            component: CapturesRoute,
            title: 'Captures',
        },
        {
            id: 'plugins',
            path: 'plugins',
            component: PluginsRoute,
            title: 'Plugins',
        }
    ]
})
export class CortexDevices {
    private isDarkTheme = false;
    private readonly store = resolve(IStore) as IStore<IDeviceState, DeviceAction>;

    public get state(): IDeviceState {
        return this.store.getState();
    }

    public modalClosed = (): void => {
        this.store.dispatch({ type: 'closeModal' });
    };

    private handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.state.showDetailsModal) {
            this.modalClosed();
        }
    }

    attached() {
        document.addEventListener('keydown', this.handleEscKey);
        this.initializeTheme();
    }

    detached() {
        document.removeEventListener('keydown', this.handleEscKey);
    }

    private initializeTheme() {
        const savedTheme = localStorage.getItem('cortex-theme');
        if (savedTheme === 'dark') {
            this.applyDarkTheme();
        } else {
            this.applyLightTheme();
        }
    }

    private applyDarkTheme() {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-theme');
        this.isDarkTheme = true;
        localStorage.setItem('cortex-theme', 'dark');
    }

    private applyLightTheme() {
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');
        document.body.classList.remove('dark-theme');
        this.isDarkTheme = false;
        localStorage.setItem('cortex-theme', 'light');
    }

    toggleTheme() {
        if (this.isDarkTheme) {
            this.applyLightTheme();
        } else {
            this.applyDarkTheme();
        }
    }

    modalBackdropClick(event) {
        if (event.target.classList.contains('modal')) {
            this.modalClosed();
        }
    }
}
