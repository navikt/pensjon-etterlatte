import { SkjemaGruppe } from './felles/SkjemaGruppe'
import { BodyShort, Box, Button, Heading, Link } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { Veileder } from './felles/Veileder'
import { SkjemaElement } from './felles/SkjemaElement'
import blomstHjerteHus from '../assets/ikoner/blomstHjerteHus.svg'
import styled from 'styled-components'

const Icon = styled.img`
    height: 4rem;
    width: 4rem;
    margin-bottom: -1.5rem;
    padding-right: 1rem;
    margin-top: 1rem;
`

export default function SystemUtilgjengelig() {
    const { t } = useTranslation()

    const omstart = () => {
        window.location.href = '/omstillingsstonad/soknad'
    }

    return (
        <div style={{ maxWidth: '500px', margin: 'auto' }}>
            <SkjemaGruppe>
                <Veileder>
                    <Heading size={'xsmall'} spacing>
                        {t('systemUtilgjengelig.veileder.tittel')}
                    </Heading>
                    <BodyShort spacing>{t('systemUtilgjengelig.veileder.beskrivelse')}</BodyShort>
                    <Button variant={'primary'} onClick={omstart}>
                        {t('systemUtilgjengelig.knappProevIgjen')}
                    </Button>
                </Veileder>
            </SkjemaGruppe>

            <SkjemaElement>
                <Heading size={'small'} spacing>
                    {t('systemUtilgjengelig.tilbakemelding.tittel')}
                </Heading>
                <Button as={'a'} variant={'secondary'} href={t('systemUtilgjengelig.tilbakemelding.href')}>
                    {t('systemUtilgjengelig.tilbakemelding.meldFra')}
                </Button>
            </SkjemaElement>

            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'small'} spacing>
                        {t('systemUtilgjengelig.merOmYtelsene')}
                    </Heading>
                </SkjemaElement>
                <SkjemaElement>
                    <Box
                        as={'a'}
                        href={t('systemUtilgjengelig.merOmYtelseneHref')}
                        borderRadius="large"
                        shadow="xsmall"
                        paddingBlock={'8'}
                        paddingInline={'6 32'}
                        style={{ color: 'var(--a-text-default)', fontSize: '20px' }}
                    >
                        <Icon alt="blomstHjerteHus" src={blomstHjerteHus} />
                        {t('systemUtilgjengelig.merOmYtelseneLenke')}
                    </Box>
                </SkjemaElement>
            </SkjemaGruppe>

            <SkjemaElement>
                <Heading size={'xsmall'} spacing>
                    {t('systemUtilgjengelig.tittel.engelsk')}
                </Heading>
                <BodyShort>
                    {t('systemUtilgjengelig.beskrivelse.engelsk.del1')}
                    <Link href={'/omstillingsstonad/soknad'} inlineText>
                        {t('systemUtilgjengelig.beskrivelse.engelsk.tryAgain')}
                    </Link>
                    {t('systemUtilgjengelig.beskrivelse.engelsk.del2')}
                </BodyShort>
            </SkjemaElement>
        </div>
    )
}
