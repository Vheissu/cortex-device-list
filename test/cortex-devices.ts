import { render } from './helper';
import { CortexDevices } from '../src/cortex-devices';

describe('cortex-devices', () => {
  it('should render message', async () => {
    const node = (await render('<my-app></my-app>', CortexDevices)).firstElementChild;
    const text =  node.textContent;
    expect(text.trim()).toBe('Hello World!');
  });
});
