import { FormSummary } from '@navikt/ds-react'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { TextGroup } from './TextGroup'

/**
 * @vitest-environment jsdom
 */

afterEach(cleanup)

describe('TextGroup', () => {
    it('Skal rendre tittel og innhold', () => {
        const { getByText } = render(
            <FormSummary.Answers>
                <TextGroup title={'Testtittel'} content={'Testcontent'} />
            </FormSummary.Answers>
        )
        expect(getByText('Testtittel')).toBeDefined()
        expect(getByText('Testcontent')).toBeDefined()
    })

    it('Skal rendre tittel som dt og innhold som dd', () => {
        const { getByText } = render(
            <FormSummary.Answers>
                <TextGroup title={'Testtittel'} content={'Testcontent'} id={'test-id'} />
            </FormSummary.Answers>
        )
        expect(getByText('Testtittel').tagName).toBe('DT')

        const innhold = getByText('Testcontent')
        expect(innhold.tagName).toBe('DD')
        expect(innhold.id).toBe('test-id')
    })
})
