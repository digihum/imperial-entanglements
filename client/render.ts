import {render} from 'react-dom';
import {createElement} from 'react';
import { home } from '../common/views/home';

render(createElement(home, null), document.getElementById("main"));
