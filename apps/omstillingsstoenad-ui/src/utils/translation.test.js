import { getTransKey } from './translation'
import { describe, expect, it } from 'vitest'

describe('Test translation-utils', () => {
    it('getTranskey skal fjerne firkantparentes fra errornavn', () => {
        const error = {
            type: 'required',
            message: '',
            ref: {
                name: 'utdanning[3].hoyesteFullfoerteUtdanning',
            },
        }
        const error2 = {
            type: 'pattern',
            message: 'test',
            ref: {
                name: 'utdanning.hoyesteFullfoerteUtdanning',
            },
        }

        const error3 = {
            type: 'pattern',
            message: 'test',
            ref: {
                name: 'utdanning.[3].hoyesteFullfoerteUtdanning',
            },
        }

        expect(getTransKey(error)).toEqual('feil.utdanning.hoyesteFullfoerteUtdanning.required')
        expect(getTransKey(error2)).toEqual('feil.utdanning.hoyesteFullfoerteUtdanning.pattern')
        expect(getTransKey(error3)).toEqual('feil.utdanning.hoyesteFullfoerteUtdanning.pattern')
    })
})
