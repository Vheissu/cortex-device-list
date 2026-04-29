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
import { updateSeo } from './seo';

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
    public isNavOpen = false;
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

    private handleRouteChange = (): void => {
        updateSeo(this.state);
        this.trackPageView();
    };

    attached() {
        document.addEventListener('keydown', this.handleEscKey);
        window.addEventListener('hashchange', this.handleRouteChange);
        this.initializeTheme();
        this.handleRouteChange();
    }

    detached() {
        document.removeEventListener('keydown', this.handleEscKey);
        window.removeEventListener('hashchange', this.handleRouteChange);
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
        this.isDarkTheme = true;
        localStorage.setItem('cortex-theme', 'dark');
    }

    private applyLightTheme() {
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');
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

    public getModalImageSrc(detail): string | null {
        const image = detail?.images?.[0]?.src || detail?.image;
        if (!image) {
            return null;
        }

        if (/^https?:\/\//.test(image)) {
            return image;
        }

        if (image.startsWith('images/')) {
            return image;
        }

        return `images/${image}`;
    }

    private trackPageView(): void {
        const gtag = window['gtag'];
        if (typeof gtag !== 'function') {
            return;
        }

        gtag('config', 'G-JE7LDG06E6', {
            page_path: `${window.location.pathname}${window.location.hash}`,
            page_title: document.title,
        });
    }

    modalBackdropClick(event) {
        if (event.target.classList.contains('modal-overlay')) {
            this.modalClosed();
        }
    }
}
