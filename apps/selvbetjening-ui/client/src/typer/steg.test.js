import { StegLabelKey, StegPath, MuligeSteg } from "./steg";
import nbLocale from '../mocks/nbLocaleMock.json';

test("Skal være 8 steg", () => {
    expect(MuligeSteg.length).toBe(6);
    expect(Object.values(StegLabelKey).length).toBe(6);
    expect(Object.values(StegPath).length).toBe(6);
});

test("Det finnes en bokmål locale for hver label", () => {
    const stegLocale = nbLocale["steg"];
    const labels = Object.values(StegLabelKey);

    expect(labels.length).toBe(6);

    labels.forEach((label) => {
        expect(stegLocale).toHaveProperty(label);
    });
});