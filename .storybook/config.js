import { configure } from '@kadira/storybook';

function loadStories() {
  require('../src/__stories__');
}

configure(loadStories, module);
