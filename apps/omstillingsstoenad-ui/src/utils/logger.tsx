import {loggFunc} from "../api/api";

export const logger = {
  info: (message: string) => {
    loggFunc(message)
        .catch((err) => {
          console.error('Unable to log info message, err: ', err)
        })
  },
}
