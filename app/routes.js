/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';

import App from './containers/App';

import AudioSelect from './components/AudioSelect';

export default () => (
  <App>
    <Route path="/" component={AudioSelect} />
  </App>
);
