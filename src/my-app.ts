import amps from "./data/amps.json";
import cabs from "./data/cabs.json";

export class MyApp {
  private currentTab = 'amps';

  private amps = amps;
  private cabs = cabs;

  private filters = [
    { value: '', keys: ['name'] },
    { value: '', keys: ['real'] },
    { value: '', keys: ['type'] }
  ];

  toggleTab(tab) {
    this.currentTab = tab;
  }
}