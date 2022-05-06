import { BodyLong, Loader } from "@navikt/ds-react";

const LoaderOverlay = ({ visible, label }: {
    visible: boolean;
    label: string;
}) => {
    if (!visible) return null;

    return (
        <div className={"spinner-overlay"}>
            <div className={"spinner-content"}>
                <Loader />
                <BodyLong spacing>
                    {label}
                </BodyLong>
            </div>
        </div>
    );
};

export default LoaderOverlay;
