import { FC } from "react";
import { Route, useRouteMatch } from "react-router";
import SoknadType from "./1-type/SoknadType";
import OpplysningerOmSokeren from "./2-soker/OpplysningerOmSokeren";
import OmDenAvdode from "./3-avdod/OmDenAvdode";
import OpplysningerOmBarn from "./4-barn/OpplysningerOmBarn";
import TidligereArbeidsforhold from "./5-tidligerearbeidsforhold/TidligereArbeidsforhold";
import NavaerendeArbeidsforhold from "./6-arbeidsforhold/NavaerendeArbeidsforhold";
import AndreYtelser from "./7-andreytelser/AndreYtelser";
import Sprakform from "./8-sprakform/Sprakform";
import ErklaeringOgUnderskrift from "./9-signering/ErklaeringOgUnderskrift";

const SoknadDialog: FC = () => {
    let { path } = useRouteMatch();

    return (
        <>
            {/* Implementer state for steget brukeren befinner seg på */}
            <Route path={`${path}/steg/1`} render={() => <SoknadType nesteSteg={2} />} />
            <Route path={`${path}/steg/2`} render={() => <OpplysningerOmSokeren forrigeSteg={1} nesteSteg={3} />} />
            <Route path={`${path}/steg/3`} render={() => <OmDenAvdode forrigeSteg={2} nesteSteg={4} />} />
            <Route path={`${path}/steg/4`} render={() => <OpplysningerOmBarn forrigeSteg={3} nesteSteg={5} />} />
            <Route path={`${path}/steg/5`} render={() => <TidligereArbeidsforhold forrigeSteg={4} nesteSteg={6} />} />
            <Route path={`${path}/steg/6`} render={() => <NavaerendeArbeidsforhold forrigeSteg={5} nesteSteg={7} />} />
            <Route path={`${path}/steg/7`} render={() => <AndreYtelser forrigeSteg={6} nesteSteg={8} />} />
            <Route path={`${path}/steg/8`} render={() => <Sprakform forrigeSteg={7} nesteSteg={9} />} />
            <Route path={`${path}/steg/9`} render={() => <ErklaeringOgUnderskrift forrigeSteg={8} />} />
        </>
    );
};

export default SoknadDialog;
