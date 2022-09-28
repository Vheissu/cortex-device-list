import Aurelia from 'aurelia';
import { CortexDevices } from './cortex-devices';

import { AureliaTableConfiguration } from 'aurelia2-table';

import 'bootstrap';
import './styles.scss';

Aurelia
  .register(AureliaTableConfiguration)
  .app(CortexDevices)
  .start();
