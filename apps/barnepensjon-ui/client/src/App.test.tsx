import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

test('barnepensjon', () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    )
    const overskrift = screen.getByText('Søknad om barnepensjon')
    expect(overskrift).toBeInTheDocument()
})
