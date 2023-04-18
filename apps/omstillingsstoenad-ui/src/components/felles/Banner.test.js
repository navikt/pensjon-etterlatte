import { render } from '@testing-library/react'
import Banner from './Banner'

describe('Banner', () => {
    it('should render given text', () => {
        const { getByText } = render(<Banner tekst="Dette er test-tekst" />)
        expect(getByText('Dette er test-tekst')).toBeInTheDocument()
    })
})
