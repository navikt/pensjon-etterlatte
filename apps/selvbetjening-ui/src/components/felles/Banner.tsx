import React from "react";
import { Heading } from "@navikt/ds-react";

const bannerStyle = {
    width: "100%",
    height: "max-content",
    padding: "0.5rem 1rem 0.5rem 1rem",
    display: "flex",
    borderBottom: "4px solid #826ba1",
    backgroundColor: "#c1b5d0",
    alignItems: "center",
    justifyContent: "center",
};

const Banner = ({ tekst }: { tekst: string }) => {
    return (
        <header style={bannerStyle} role="banner">
            <Heading size={"xlarge"}>{tekst}</Heading>
        </header>
    );
};

export default Banner;
