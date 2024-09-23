import { defineField } from 'sanity'

export const spraakStringFields = [
    defineField({ name: 'NB', type: 'string' }),
    defineField({ name: 'NN', type: 'string' }),
    defineField({ name: 'EN', type: 'string' }),
]

export const spraakBlockFields = [
    defineField({ name: 'NB', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'NN', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'EN', type: 'array', of: [{ type: 'block' }] }),
]
