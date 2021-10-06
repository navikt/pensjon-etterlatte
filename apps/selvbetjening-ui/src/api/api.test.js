import { axiosInstance } from "./axios";
import { lagreSoeknad, sendSoeknad } from "./api";

jest.mock("./axios");

describe("Test sending av søknad", () => {
    it("Søknadsobjekt fylles ut korrekt", async () => {
        process.env = { NAIS_APP_IMAGE: "docker.pkg.github.com/navikt/pensjon-etterlatte/selvbetjening-ui:02c77cfce65041d5261115dcc94179dffe04cae1" }

        const soeknad = {
            harSamtykket: true,
            klarForLagring: true,
            visFortsettSoeknadModal: false
        };

        const expectedResult = {data: {id: 1}};
        axiosInstance.post.mockResolvedValue(expectedResult);

        const result = await sendSoeknad(soeknad);

        expect(axiosInstance.post).toHaveBeenCalledWith(
                `/api/soeknad`,
                {
                    ...soeknad,
                    klarForLagring: undefined,
                    imageTag: "selvbetjening-ui:02c77cfce65041d5261115dcc94179dffe04cae1"
                }
        );

        expect(result).toBe(expectedResult.data);
    });
});

describe("Test lagring av søknad kladd", () => {
    it("Klar for lagring blir tilbakestilt", async () => {
        const soeknad = {
            harSamtykket: true,
            klarForLagring: true,
            visFortsettSoeknadModal: false
        };

        const expectedResult = { data: { id: 1 } };
        axiosInstance.post.mockResolvedValue(expectedResult);

        const result = await lagreSoeknad(soeknad);

        expect(axiosInstance.post).toHaveBeenCalledWith(
                `/api/kladd`,
                {
                    ...soeknad,
                    klarForLagring: undefined
                }
        );

        expect(result).toBe(expectedResult.data);
    });
});



