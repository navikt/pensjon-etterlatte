import {loggFunc} from "../api/api";

const defaultContext = {
  url: window.location.href,
  userAgent: window.navigator.userAgent,
  appName: 'etterlatte-barnepensjon-ui',
}

export const logger = {
  info: (message: string) => {
    const data = { type: 'info', stackInfo: message, jsonContent: { ...defaultContext } }
    loggFunc(data)
      .catch((err) => {
        console.error('Unable to log info message: ', data, ' err: ', err)
      })
  },
}
