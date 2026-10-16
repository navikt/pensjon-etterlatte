import { Box, Select, VStack } from '@navikt/ds-react'
import { Language } from '../../i18n'

interface Props {
    value?: Language | undefined
    onChange: (value: Language) => void
    label: string
}

export const SpraakvalgSelect = ({ value, onChange, label }: Props) => {
    return (
        <VStack marginBlock="space-0 space-48" align="center">
            <Box width="12rem">
                <Select onChange={(e) => onChange(e.target.value as Language)} value={value} label={label}>
                    <option value={Language.NORSK_BOKMAAL}>Bokmål</option>
                    <option value={Language.NORSK_NYNORSK}>Nynorsk</option>
                    <option value={Language.ENGELSK}>English</option>
                </Select>
            </Box>
        </VStack>
    )
}
