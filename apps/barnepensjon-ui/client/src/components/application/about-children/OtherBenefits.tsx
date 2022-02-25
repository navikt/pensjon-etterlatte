import { SkjemaGruppe } from 'nav-frontend-skjema'
import { RHFCheckboksPanel } from '../../common/rhf/RHFCheckboksPanelGruppe'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import { IApplication } from '../../../context/application/application'
import useTranslation from '../../../hooks/useTranslation'
import { JobbStatus } from '../../../types/situation'
import { IChild } from '../../../types/person'
import { IngenJobb } from '../../../types/workingConditions'

const OtherBenefits = ({ application, child }: { application: IApplication; child?: IChild[] }) => {
    const { t } = useTranslation('omBarn')
    const situation = application.yourSituation || {}

    const isEmployee = situation.arbeidsforhold || situation.selvstendig
    const isJobSeeker = situation.jobbStatus?.includes(JobbStatus.arbeidssoeker)
    const establishedCompany = situation.ingenJobbBeskrivelse === IngenJobb.etablererBedrift
    const isSick = situation.ingenJobbBeskrivelse === IngenJobb.syk
    const inEducation = situation.utdanning?.naavaerendeUtdanning
    const hasChildren = (child && child.length > 0) || false

    const rettTilBarnetilsyn = hasChildren && (isEmployee || establishedCompany || isSick)
    const rettTilBarnStoenad = hasChildren && (inEducation || isJobSeeker)

    return (
        <>
            {rettTilBarnetilsyn && (
                <SkjemaGruppe>
                    <RHFCheckboksPanel
                        name={'soeknadOmBarnetilsyn'}
                        legend={t('soeknadOmBarnetilsyn')}
                        description={t('soeknadOmBarnetilsyn.beskrivelse')}
                        valgfri={true}
                        checkbox={{
                            label: t('soeknadOmBarnetilsyn.bekreftelse'),
                            value: JaNeiVetIkke.JA,
                        }}
                    />
                </SkjemaGruppe>
            )}

            {rettTilBarnStoenad && (
                <SkjemaGruppe>
                    <RHFCheckboksPanel
                        name={'soeknadOmTilleggsstoenadBarnepass'}
                        legend={t('soeknadOmTilleggsstoenadBarnepass')}
                        description={t('soeknadOmTilleggsstoenadBarnepass.beskrivelse')}
                        valgfri={true}
                        checkbox={{
                            label: t('soeknadOmTilleggsstoenadBarnepass.bekreftelse'),
                            value: JaNeiVetIkke.JA,
                        }}
                    />
                </SkjemaGruppe>
            )}
        </>
    )
}

export default OtherBenefits
