import styled from 'styled-components'
import { List, Modal } from '@navikt/ds-react'
import { SkjemaGruppe } from './SkjemaGruppe'

const navigasjonsRad = `
  width: 100%;
  display: flex;
  justify-content: center;
  column-gap: 1rem;
  margin-bottom: 2rem;

  .knapp {
    margin-bottom: 0;
 }
`

export const NavigasjonsRad = styled.div`
    ${navigasjonsRad}
`

export const NavigasjonsRadSkjemaGruppe = styled(NavigasjonsRad)<{ $disabled?: boolean }>`
    ${(props) => (props.$disabled ? 'opacity: 0.6; pointer-events: none;' : '')}
`

export const NavigasjonsRadSection = styled.section`
    ${navigasjonsRad}
`

export const InfokortHeader = styled.div<{ $gjennomsiktig?: boolean }>`
    box-sizing: border-box;
    height: 128px;
    background-color: #4d3e55;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom: 4px solid #826ba1;
    display: flex;
    align-items: flex-end;
    opacity: ${(props) => (props.$gjennomsiktig ? 0.4 : 1)};
    img {
        margin: 0 auto;
    }
`

export const InfokortInformasjonsboks = styled.div`
    padding: 2rem 2rem;
`

export const Infokort = styled.div`
    .typo-element {
        margin: 0.3rem 0;
    }

    background-color: #e7e9e9;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    flex-grow: 1;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    @media screen and (min-width: 650px) {
        max-width: 49%;
    }
`

export const SkjemaGruppeRad = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
    column-gap: 1rem;

    @media screen and (max-width: 650px) {
        flex-direction: column;
    }
`

export const SkjemaGruppeIngress = styled(SkjemaGruppe)`
    margin-bottom: 1em !important;
`

export const SpoersmaalModal = styled(Modal)`
    max-width: 650px;
    width: 100%;
    position: fixed !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    text-align: center;
    padding: 3rem;

    @media screen and (max-width: 650px) {
        .knapp {
            font-size: 0.8em;
            padding: 0 1em;
        }
    }

    .navds-modal__button {
        visibility: hidden;
    }
`

export const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`

export const InputWithCurrency = styled.div<{ $hasError?: boolean }>`
    display: flex;
    position: relative;
    .currency {
        align-self: end;
        height: 3rem;
        display: flex;
        align-items: center;
        position: absolute;
        left: 10rem;
        bottom: ${(props) => (props.$hasError ? '2rem' : 0)};
    }

    input {
        max-width: 9rem;
    }
`

export const NumberSelectRad = styled.div`
    display: flex;
    gap: 1rem;

    @media screen and (max-width: 650px) {
        flex-direction: column;
    }
`

export const ListItemWithIndent = styled(List.Item)`
    margin-left: 1rem;
`
