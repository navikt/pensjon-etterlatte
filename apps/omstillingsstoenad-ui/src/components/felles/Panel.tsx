import { Box } from '@navikt/ds-react'
import { ComponentProps, ReactNode } from 'react'
import { ResponsiveProp, SpacingScale } from '@navikt/ds-react/src/layout/utilities/types'
interface PanelProps extends ComponentProps<"div">{
    children: ReactNode
    border?: boolean
    padding?: ResponsiveProp<SpacingScale>
}
export const Panel = ({
    children,
    border = false,
    padding = '4',
    ...props
}: PanelProps) => (
    <Box
        background={'surface-default'}
        padding={padding}
        borderColor={border ? 'border-default' : undefined}
        borderWidth={border ? '1' : '0'}
        borderRadius={border ? 'small' : undefined}
        {...props}
    >
        {children}
    </Box>
)
