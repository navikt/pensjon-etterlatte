import { useEffect, useRef } from 'react'

const useEffectOnce = (callback: () => void, condition = true) => {
    const called = useRef(false)

    useEffect(() => {
        if (condition && !called.current) {
            called.current = true
            callback()
        }
    }, [callback, condition])
}

export default useEffectOnce
