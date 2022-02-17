import request from 'supertest'
import app from './server'
import config from './config'

describe('Test at server starter gir korrekte resultater', () => {
  test('Skal returnere OK hvis appen kjoerer', async () => {
    await request(app).get(`${config.default.app.basePath}/isAlive`).expect(200)
    await request(app).get(`${config.default.app.basePath}/isReady`).expect(200)
  })

  test('Skal returnere metrics', async () => {
    const res = await request(app).get(`${config.default.app.basePath}/metrics`).expect(200)
    expect(res.text.includes('process_cpu_user_seconds_total')).toBe(true)
  })
})
