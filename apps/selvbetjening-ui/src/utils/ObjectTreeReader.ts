import { i18n } from "i18next";

interface Tekst {
    key: string;
    val: string | Date | number;
}

export default class ObjectTreeReader {
    private dtf: Intl.DateTimeFormat;

    constructor(i18n: i18n) {
        this.dtf = Intl.DateTimeFormat(i18n.language, { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    traverse<T>(objectToTraverse: T, baseKey?: string): Tekst[] {
        return Object.entries(objectToTraverse)
            .flatMap(value => {
                const val = value[1]

                const key = baseKey ? baseKey.concat(".").concat(value[0]) : value[0]

                if (!!val && typeof val === "object" && !(val instanceof Date)) return this.traverse(val, key)
                else return { key, val: this.stringify(val) }
            })
    }

    private isDateString = (value: any): boolean => {
        if (typeof value === "string") return !!value.match(/\d{4}-\d{2}-\d{2}.*/)?.length
        else return false
    }

    private stringify = (val: any): string => {
        if (this.isDateString(val) || val instanceof Date) return this.dtf.format(new Date(val))
        else return val?.toString()
    }

}
