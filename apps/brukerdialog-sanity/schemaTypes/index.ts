import {defineField, defineType} from 'sanity'


const type = defineType({
  name: 'veiledningstekst',
  title: 'Veiledningstekst',
  type: 'document',
  fields: [
    defineField({
      name: 'Navn',
      type: 'string'
    }),
    defineField({
      name: 'NB',
      type: 'array',
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'NN',
      type: 'array',
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'EN',
      type: 'array',
      of: [{type: 'block'}]
    })
  ]
})


export const schemaTypes = [type, eventType]
