import { Box } from '@navikt/ds-react'
import { ComponentProps, ReactNode } from 'react'

interface PanelProps extends ComponentProps<'div'> {
    children: ReactNode
}
export const Panel = ({ children, ...props }: PanelProps) => (
    <Box background={'default'} padding="space-16" {...props}>
        {children}
    </Box>
)
