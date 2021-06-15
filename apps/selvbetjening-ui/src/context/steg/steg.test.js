import { StegLabelKey, StegPath, MuligeSteg } from "./steg";
import nbLocale from "../../assets/locales/nb.json"

test("Skal være 8 steg", () => {
    expect(MuligeSteg.length).toBe(8)
    expect(Object.values(StegLabelKey).length).toBe(8)
    expect(Object.values(StegPath).length).toBe(8)
});

test("Det finnes en bokmål locale for hver label", () => {
    const stegLocale = nbLocale["steg"]
    const labels = Object.values(StegLabelKey)

    expect(labels.length).toBe(8)

    labels.forEach((label) => {
        expect(stegLocale).toHaveProperty(label)
    })
});
