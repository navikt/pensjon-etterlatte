import {Alert} from "@navikt/ds-react";
import useTranslation from "./hooks/useTranslation";

export const Vedlikehold = () => {
    const { t } = useTranslation('app')

    return (
            <Alert variant="warning">
                {t('vedlikehold')}
            </Alert>
    )
}