import { Translation } from '../../context/language/translations'
import { useEffect, useRef, useState } from 'react'

interface TranslationProps {
    value: Translation
}

export default function Trans({ value }: TranslationProps) {
    const ref = useRef<HTMLSpanElement>(null)

    const [translation] = useState(value)

    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = translation
        }
    }, [ref.current, translation])

    return <span ref={ref} />
}
