export const emailMatcher = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const partialKontonrMatcher = /^([1-9]\d{0,3})\.?(\d{0,2})\.?(\d{0,5})$/
export const kontonrMatcher = /^[1-9]\d{3}\.\d{2}\.\d{5}$/

export const telefonnrMatcher = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/

export const partialProsentMatcher = /^(100%?|[1-9]?\d%?)$/
export const prosentMatcher = /^(100|[1-9]?\d)%?$/
