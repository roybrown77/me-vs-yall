import React from 'react';
import { render } from '../../test-utils';
import Immutable from 'immutable';
import { BrowserRouter as Router } from "react-router-dom";

import Component from './index';

test('renders learn react link', () => {
  const { getByText } = render(<Router><Component /></Router>, { initialState: Immutable.Map() });
  const linkElement = getByText(/Scores/i);
  expect(linkElement).toBeInTheDocument();
});