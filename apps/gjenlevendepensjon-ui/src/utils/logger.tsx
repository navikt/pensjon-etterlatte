import {loggFunc} from "../api/api";

export const logger = {
  info: (message: string) => {
    const data = { type: 'info', stackInfo: message, jsonContent: { } }
    loggFunc(data)
      .catch((err) => {
        console.error('Unable to log info message: ', data, ' err: ', err)
      })
  },
}
