import { Translation } from '../../context/language/translations'
import { useEffect, useRef } from 'react'

interface TranslationProps {
    value: Translation
}

/**
 * Supports text containing HTML.
 */
export default function Trans({ value }: TranslationProps) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = value
        }
    }, [value])

    return <span ref={ref} />
}
