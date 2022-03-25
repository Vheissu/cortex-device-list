import amps from "./data/amps.json";
import cabs from "./data/cabs.json";

export class MyApp {
  private currentTab = 'amps';

  private amps = amps;
  private cabs = cabs;

  private filters = [
    { value: '', keys: ['name'] },
    { value: '', keys: ['real'] },
    { value: '', keys: ['type'] },
    { value: '', keys: ['irAuthor'] },
  ];

  toggleTab(tab) {
    this.currentTab = tab;
    
    for (const filter of this.filters) {
      filter.value = '';
    }
  }
}