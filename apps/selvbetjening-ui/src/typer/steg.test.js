import { StegLabelKey, StegPath, MuligeSteg } from "./steg";
import nbLocale from "../locales/nb";
import nnLocale from "../locales/nn";
import enLocale from "../locales/en";

test("Skal være 8 steg", () => {
    expect(MuligeSteg.length).toBe(6);
    expect(Object.values(StegLabelKey).length).toBe(6);
    expect(Object.values(StegPath).length).toBe(6);
});

test("Det finnes en bokmål locale for hver label", () => {
    const localeKeys = Object.keys(nbLocale).filter(key => key.includes("steg."))
    const labels = Object.values(StegLabelKey);

    expect(labels.length).toBe(6);

    labels.forEach((label) => {
        expect(localeKeys).toContain(label);
    });
});

test("Det finnes en engelsk locale for hver label", () => {
    const localeKeys = Object.keys(enLocale).filter(key => key.includes("steg."))
    const labels = Object.values(StegLabelKey);

    expect(labels.length).toBe(6);

    labels.forEach((label) => {
        expect(localeKeys).toContain(label);
    });
});

test("Det finnes en nynorsk locale for hver label", () => {
    const localeKeys = Object.keys(nnLocale).filter(key => key.includes("steg."))
    const labels = Object.values(StegLabelKey);

    expect(labels.length).toBe(6);

    labels.forEach((label) => {
        expect(localeKeys).toContain(label);
    });
});