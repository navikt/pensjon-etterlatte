import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

export const IkkeGyldigAlder = () => {
    return (
        <>
            <div>Info om ikke gyldig alder</div>
            <div>
                <Button
                    as={'a'}
                    variant="primary"
                    icon={<ArrowRightIcon aria-hidden />}
                    iconPosition="right"
                    rel="noopener noreferrer"
                    href={'veldig fin lenke'}
                >
                    Gå til Nav knapp
                </Button>
            </div>
        </>
    )
}
