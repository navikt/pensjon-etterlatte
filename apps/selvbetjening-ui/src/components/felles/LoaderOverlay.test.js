import { render } from "@testing-library/react";
import LoaderOverlay from "./LoaderOverlay";
describe("LoaderOverlay", () => {
    it("skal vise loader", () => {
        const { getByText } = render(<LoaderOverlay visible={true} label="Testlabel" />);
        expect(getByText("Testlabel")).toBeDefined();
    });
    it("skal ikke vise loader", () => {
        const { container } = render(<LoaderOverlay label="Testlabel" />);
        expect(container.firstChild).toBeNull();
        expect(container).toMatchSnapshot();
    });
});
