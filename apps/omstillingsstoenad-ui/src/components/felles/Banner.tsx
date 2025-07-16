import { Box, Heading, HStack, VStack } from '@navikt/ds-react'
import React from 'react'

const Banner = ({ tekst }: { tekst: string }) => {
    return (
        <Box
            as="header"
            role="banner"
            borderWidth="0 0 4 0"
            style={{
                borderBottomColor: '#826ba1',
                backgroundColor: '#c1b5d0',
            }}
        >
            <HStack justify="center" paddingBlock="2" paddingInline="4">
                <VStack align="center">
                    <Heading size={'large'}>{tekst}</Heading>
                </VStack>
            </HStack>
        </Box>
    )
}

export default Banner
