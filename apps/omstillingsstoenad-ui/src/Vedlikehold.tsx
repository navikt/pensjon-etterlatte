import {Alert} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";

export const Vedlikehold = () => {
    const { t } = useTranslation()

    return (
         <Alert variant="warning">
             {t('vedlikehold')}
         </Alert>
 )
}