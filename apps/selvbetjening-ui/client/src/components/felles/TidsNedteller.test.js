import { render } from "@testing-library/react";
import TidsNedteller from "./TidsNedteller";
import { act } from "react-dom/test-utils";

describe("TidsNedteller", () => {
    it("skal rendre default gjenvaerende tid", () => {
        const { getByText } = render(<TidsNedteller />);
        expect(getByText("00:01:00")).toBeInTheDocument();
    });

    it("skal rendre 1 time, 3 minutter og 40 sekunder", () => {
        const props = { timer: 1, minutter: 3, sekunder: 40 };

        const { getByText } = render(<TidsNedteller {...props} />);
        expect(getByText("01:03:40")).toBeInTheDocument();
    });

    it("skal telle ned to sekunder fra 01:03:40", async () => {
        jest.useFakeTimers();
        const props = { timer: 1, minutter: 3, sekunder: 40 };

        const { getByText } = render(<TidsNedteller {...props} />);
        expect(getByText("01:03:40")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(getByText("01:03:39")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(getByText("01:03:38")).toBeInTheDocument();
    });

    it("skal kun vise minutter og sekunder", () => {
        const props = { timer: 1, minutter: 3, sekunder: 40, visTimer: false };

        const { getByText } = render(<TidsNedteller {...props} />);
        expect(getByText("03:40")).toBeInTheDocument();
    });
});
