// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./countdown.worker'
import { CountdownMessage } from '../../types/countdown'

class WebWorker {
    private worker!: Worker
    private endTime?: number
    private callbackFn?: (remainingTime: number) => void
    private countdown?: number

    constructor() {
        if (!window.Worker) {
            console.warn('Webworkers not supported, will use regular intervals')
            return
        }
        this.worker = new Worker()
        this.initialiser()
    }

    private initialiser() {
        this.worker.onmessage = (event: MessageEvent<{ msg: CountdownMessage; id: string; period: number }>) => {
            const data = event.data

            if (!data) return

            if (data?.msg === CountdownMessage.COUNTDOWN_NOTIFICATION) {
                if (this.callbackFn) {
                    this.callbackFn(data.period)
                }
            }
        }
    }

    private listenToWorker = () => {
        try {
            this.worker.postMessage({ msg: CountdownMessage.REGISTER_COUNTDOWN_LISTENER, endTime: this.endTime })
        } catch (e) {
            console.log(e)
            console.log('Unable to register listener, starting default interval.')
            this.countdown = window.setInterval(() => {
                this.sendCountdownBackup(new Date().valueOf())
            }, 1000)
        }
    }

    registerCountdownListener = ({ endTime, callbackFn }: { endTime: number; callbackFn: (props: number) => void }) => {
        if (!this.worker) {
            throw new Error('No webworker detected, the browser might not support it')
        }
        this.endTime = endTime
        this.callbackFn = callbackFn
        this.listenToWorker()
    }

    removeCountdownListener = () => {
        this.worker.postMessage({ msg: CountdownMessage.REMOVE_COUNTDOWN_LISTENER })
        if (this.countdown) {
            clearInterval(this.countdown)
        }
    }

    updateEndTime = (endTime: number) => {
        this.worker.postMessage({ msg: CountdownMessage.UPDATE_COUNTDOWN_LISTENER, endTime })
    }

    sendCountdownBackup = (currentTime: number) => {
        if (!this.callbackFn || !this.endTime) return
        const period = Math.floor((this.endTime - currentTime.valueOf()) / 1000)

        this.callbackFn(period)
    }
}

const webWorker =  new WebWorker()
export default webWorker
