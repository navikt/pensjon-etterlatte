import { useEffect, useState } from 'react'
import { getCurrencies } from '../api/api'
import useTranslation from './useTranslation'

interface useCurrencies {
    currencies: options[]
}

interface options {
    label?: string | undefined
    value: string
}

interface Currency {
    isoKode: string
    gyldigFra: string
    gyldigTil: string
    beskrivelse: {
        term: string
        tekst: string
    }
}

const sortByText = (a: Currency, b: Currency) => {
    if (a.beskrivelse.tekst > b.beskrivelse.tekst) {
        return 1
    }
    return -1
}

export const moveMostUsedCurrenciesToBeginning = (currencies: Currency[]) => {
    const frequentlyUsed = ['SEK', 'NOK', 'EUR']

    const frequentlyUsedCurrencies = currencies.filter((currency) => frequentlyUsed.includes(currency.isoKode))

    if (frequentlyUsedCurrencies) frequentlyUsedCurrencies.forEach((currency) => currencies.unshift(currency))

    return currencies
}

export const useCurrencies = (): useCurrencies => {
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const { t } = useTranslation('common')

    useEffect(() => {
        ;(async () => {
            try {
                let currencyList: Currency[] = await getCurrencies()
                currencyList = currencyList.sort(sortByText)
                setCurrencies(moveMostUsedCurrenciesToBeginning(currencyList))
            } catch (e) {
                console.log(e)
            }
        })()
    }, [])

    const optionsList = (currency: Currency[]): options[] => {
        const currencyList = currency.map((currency) => {
            const tekst = currency.beskrivelse.tekst + ' (' + currency.isoKode + ')'
            return {
                label: tekst,
                value: tekst,
            }
        })

        currencyList.unshift({
            label: t('chooseCurrency'),
            value: t(''),
        })
        return currencyList
    }

    return { currencies: optionsList(currencies) }
}
