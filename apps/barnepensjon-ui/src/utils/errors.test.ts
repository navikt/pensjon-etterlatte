import { getErrorKey } from './errors'

describe('Test error', () => {
    it('should return correct error key', function () {
        const errorObject = {
            type: 'required',
            message: '',
            ref: {
                name: 'firstName',
            },
        }
        const errorKey = getErrorKey(errorObject)

        expect(errorKey).toBe('firstName.required')
    })

    it('should return empty string', function () {
        expect(getErrorKey()).toEqual('')
    })
})
