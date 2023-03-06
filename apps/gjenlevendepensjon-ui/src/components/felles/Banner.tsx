import React from "react";
import { Heading } from "@navikt/ds-react";
import styled from "styled-components";

const BannerWrapper = styled.header`
    width: 100%;
    height: max-content;
    padding: 0.5rem 1rem 0.5rem 1rem;
    display: flex;
    border-bottom: 4px solid #826ba1;
    background-color: #c1b5d0;
    align-items: center;
    justify-content: center;
`

const Banner = ({ tekst }: { tekst: string }) => {
    return (
        <BannerWrapper role="banner">
            <Heading size={"xlarge"}>{tekst}</Heading>
        </BannerWrapper>
    );
};

export default Banner;
