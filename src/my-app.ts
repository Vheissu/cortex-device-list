import amps from "./data/amps.json";

export class MyApp {
  private amps = amps;

  private filters = [
    { value: '', keys: ['name'] },
    { value: '', keys: ['real'] },
    { value: '', keys: ['type'] }
  ];
}