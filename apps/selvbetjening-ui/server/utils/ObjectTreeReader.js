
class ObjectTreeReader {
    constructor(t, i18n) {
        this.t = t;
        this.dtf = Intl.DateTimeFormat(i18n.language, { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    traverse(object, baseKey) {
        return Object.entries(object)
            .filter(value => !!value[1])
            .flatMap(value => {
                const val = value[1]

                const key = this.getKey(value[0], baseKey)

                if (!!val && typeof val === "object" && !(val instanceof Date))
                    return this.traverse(val, key)
                else {
                    return {
                        key,
                        spoersmaal: this.t(key),
                        svar: this.stringify(val)
                    }
                }
            })
    }

    getKey = (key, baseKey) => {
        const newKey = !!baseKey ? baseKey.concat(".").concat(key) : key

        return newKey.replace(/(.\d+)/g, "");
    }

    isDateString = (value) => {
        if (typeof value === "string") return !!value.match(/\d{4}-\d{2}-\d{2}.*/)?.length
        else return false
    }

    isTranslationKey = (value) => {
        if (typeof value === "string") return !!value.match(/[a-z]+\.[a-z]+(\.[a-z]+)?/)?.length
        else return false
    }

    stringify = (val) => {
        if (this.isDateString(val) || val instanceof Date)
            return this.dtf.format(new Date(val))
        else if (this.isTranslationKey(val))
            return this.t(val)
        else
            return val?.toString()
    }
}

module.exports = {
  ObjectTreeReader
}