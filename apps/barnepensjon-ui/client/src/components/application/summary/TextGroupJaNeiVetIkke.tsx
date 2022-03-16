import { BodyShort, Label } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'

const TextGroupJaNeiVetIkke = ({ title, content, id }: { title: string; content?: any; id?: string }) => {
    const { t } = useTranslation('radiobuttons')

    return (
        <div className={'tekstgruppe'}>
            <Label>{title}</Label>
            <BodyShort id={id}>{t(content)}</BodyShort>
        </div>
    )
}

export default TextGroupJaNeiVetIkke
