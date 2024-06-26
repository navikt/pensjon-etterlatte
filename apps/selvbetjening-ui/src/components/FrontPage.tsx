import { List } from '@navikt/ds-react'
import useTranslation from '../hooks/useTranslation'
import styled from 'styled-components'

export const ListItemWithIndent = styled(List.Item)`
    margin-left: 1rem;
`

export default function FrontPage() {
    // const navigate = useNavigate() TODO

    const { t } = useTranslation('frontPage')
    // const { logEvent } = useAmplitude() TODO

    return (
        <div>Selvbetjening</div>
    )
}
