import { BodyLong } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, Route } from 'react-router'
import { StegPath, steg } from '../../typer/steg'
import { InntektSteg } from './inntekt/Inntekt'
import Personopplysninger from './Personopplysninger'
import { SoeknadStegRute } from './SoeknadSteg'
import SoknadDialog from './SoknadDialog'
import { SituasjonenDinSteg } from './situasjonenDin/SituasjonenDin'

const UnderArbeid = () => {
    const { t } = useTranslation()
    return <BodyLong>{t('skjema.underArbeid')}</BodyLong>
}

const stegKomponenter: Partial<Record<StegPath, ReactNode>> = {
    personopplysninger: (
        <SoeknadStegRute>
            <Personopplysninger />
        </SoeknadStegRute>
    ),
    'situasjonen-din': <SituasjonenDinSteg />,
    inntekt: <InntektSteg />,
}

export const soeknadStegRuter = () => (
    <Route path="skjema" element={<Outlet />}>
        <Route path="steg" element={<SoknadDialog />}>
            {steg.map(({ path }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        stegKomponenter[path] ?? (
                            <SoeknadStegRute>
                                <UnderArbeid />
                            </SoeknadStegRute>
                        )
                    }
                />
            ))}
        </Route>
    </Route>
)
