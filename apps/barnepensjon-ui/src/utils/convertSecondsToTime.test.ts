import { convertSecondsToTime } from './convertSecondsToTime'

describe('Test that seconds are converted to hours, minutes and seconds', () => {
    it('Should correctly convert', () => {
        expect(convertSecondsToTime(0)).toStrictEqual({ hours: 0, minutes: 0, seconds: 0 })
        expect(convertSecondsToTime(59)).toStrictEqual({ hours: 0, minutes: 0, seconds: 59 })
        expect(convertSecondsToTime(60)).toStrictEqual({ hours: 0, minutes: 1, seconds: 0 })
        expect(convertSecondsToTime(120)).toStrictEqual({ hours: 0, minutes: 2, seconds: 0 })
        expect(convertSecondsToTime(123)).toStrictEqual({ hours: 0, minutes: 2, seconds: 3 })
        expect(convertSecondsToTime(3600)).toStrictEqual({ hours: 1, minutes: 0, seconds: 0 })
        expect(convertSecondsToTime(3601)).toStrictEqual({ hours: 1, minutes: 0, seconds: 1 })
        expect(convertSecondsToTime(3661)).toStrictEqual({ hours: 1, minutes: 1, seconds: 1 })
    })
})
