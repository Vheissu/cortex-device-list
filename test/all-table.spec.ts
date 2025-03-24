import { render } from './helper';
import { AllTable } from '../src/views/all-table';

describe('all-table', () => {
  it('should render message', async () => {
    const node = (await render('<all-table></all-table>', AllTable)).firstElementChild;
    const text =  node.textContent;
    expect(text.trim()).toBe('Hello World!');
  });
});
