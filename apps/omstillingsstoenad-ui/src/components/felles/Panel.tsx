import { Box } from '@navikt/ds-react'
import { ComponentProps, ReactNode } from 'react'
import { ResponsiveProp, SpacingScale, SpaceDelimitedAttribute } from '@navikt/ds-react/src/layout/utilities/types'

interface PanelProps extends ComponentProps<'div'> {
    children: ReactNode
    borderRadius?: boolean
    borderColor?: 'border-default' | 'border-info'
    borderWidth?: SpaceDelimitedAttribute<'0' | '1' | '2' | '3' | '4' | '5'>
    padding?: ResponsiveProp<SpacingScale>
    background?: 'surface-default' | 'surface-selected'
}
export const Panel = ({
    children,
    borderRadius = false,
    padding = '4',
    background = 'surface-default',
    borderWidth = '0',
    borderColor,
    ...props
}: PanelProps) => (
    <Box
        background={background}
        padding={padding}
        borderColor={borderColor}
        borderWidth={borderWidth}
        borderRadius={borderRadius ? 'small' : undefined}
        {...props}
    >
        {children}
    </Box>
)
