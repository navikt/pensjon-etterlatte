import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('barnepensjon', () => {
  render(<App />);
  const linkElement = screen.getByText(/barnepensjon/i);
  expect(linkElement).toBeInTheDocument();
});
