import Aurelia from 'aurelia';
import { MyApp } from './my-app';

import { AureliaTableConfiguration } from 'aurelia2-table';

import 'bootstrap';

Aurelia
  .register(AureliaTableConfiguration)
  .app(MyApp)
  .start();
