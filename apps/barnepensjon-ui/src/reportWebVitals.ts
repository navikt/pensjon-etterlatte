import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'

const reportWebVitals = (onPerfEntry?: any) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(() => {
            onCLS(onPerfEntry)
            onINP(onPerfEntry)
            onFCP(onPerfEntry)
            onLCP(onPerfEntry)
            onTTFB(onPerfEntry)
        })
    }
}

export default reportWebVitals
