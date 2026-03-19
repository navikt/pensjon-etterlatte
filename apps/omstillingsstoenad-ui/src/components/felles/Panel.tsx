import { Box } from '@navikt/ds-react'
import { ResponsiveProp, SpacingScale } from '@navikt/ds-react/esm/primitives/utilities/types'
import { ComponentProps, ReactNode } from 'react'

interface PanelProps extends ComponentProps<'div'> {
    children: ReactNode
    padding?: ResponsiveProp<SpacingScale>
}
export const Panel = ({ children, padding = 'space-16', ...props }: PanelProps) => (
    <Box background={'default'} padding={padding} {...props}>
        {children}
    </Box>
)
