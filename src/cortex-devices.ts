import { Data } from './data';
import { Views } from './views';
export class CortexDevices {
    private currentTab = 'all';
    private isDarkTheme = false;

    private data = {
        all: [],
        amps: [],
        cabs: [],
        effects: [],
        captures: [],
        details: [],
        plugins: []
    };

    private views = Views;
    private showDetailsModal = false;
    private currentlySelectedDetail;

    private nav = [
        {
            label: 'All',
            slug: 'all',
        },
        {
            label: 'Amps',
            slug: 'amps',
        },
        {
            label: 'Cabs',
            slug: 'cabs',
        },
        {
            label: 'Effects',
            slug: 'effects',
        },
        {
            label: 'Captures',
            slug: 'captures',
        },
        {
            label: 'Plugins',
            slug: 'plugins',
        }
    ];

    constructor() {
        if (Data) {
            for (const key in Data) {
                this.data[key] = this.sortArrayOfObjectsAlphabetically(Data[key], 'name');
            }
        }

        this.data.all = [].concat(...Object.values(this.data));
    }

    sortArrayOfObjectsAlphabetically(array, key) {
        return array.sort((a, b) => {
            const nameA = a[key].toLowerCase();
            const nameB = b[key].toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }

    private handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.showDetailsModal) {
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
        // Check localStorage for saved theme preference
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

    modalClosed() {
        this.showDetailsModal = false;
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            this.currentlySelectedDetail = null;
        }, 200);
    }

    modalBackdropClick(event) {
        // Only close if clicking directly on the backdrop (modal-dialog parent)
        if (event.target.classList.contains('modal')) {
            this.modalClosed();
        }
    }

    triggerShowDetails = (device) => {
        const detailId = device.detailsId || device.id;
        const detail = this.data.details.find((d) => d.id === detailId) ?? null;
        if (detail) {
            this.currentlySelectedDetail = detail;
            this.showDetailsModal = true;
            document.body.classList.add('modal-open');
            
            // Initialize the carousel when modal is shown
            setTimeout(() => {
                const carousel = document.getElementById('imageCarousel');
                if (carousel) {
                    // Use native approach to trigger carousel functionality
                    // Bootstrap will auto-initialize components with data-bs-ride attribute
                    carousel.setAttribute('data-bs-ride', 'carousel');
                }
            }, 100);
        }
    }

    getItemById = (itemId, dataType) => {
        return this.data[dataType].find((item) => item.id === itemId) ?? null;
    }

    toggleTab(tab) {
        this.currentTab = tab;
    }
}
