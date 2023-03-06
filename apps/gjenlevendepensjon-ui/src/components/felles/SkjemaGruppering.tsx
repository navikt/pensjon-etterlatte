import { FC } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { SkjemaGruppeProps } from "nav-frontend-skjema/lib/skjema-gruppe";
import styled from "styled-components";

const SkjemaGrupperingWrapper = styled(SkjemaGruppe)`
  margin-bottom: 3rem !important;

  .skjemagruppe {
    margin-bottom: 1.5rem !important;

    .skjemaelement {
      margin-bottom: 0 !important;
    }
  }

  .skjemaelement {
    margin-bottom: 1.5rem !important;
  }
`

const SkjemaGruppering: FC<SkjemaGruppeProps> = ({ children }) => {
    return (
        <SkjemaGrupperingWrapper>
            {children}
        </SkjemaGrupperingWrapper>
    )
}

export default SkjemaGruppering;
