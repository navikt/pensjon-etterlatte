import request from 'supertest'
import app from './mock-server'
import config from '../config'

import { STOR_SNERK } from './mock-user'
import mockLand from './landMock'

describe('Test at mock-api gir korrekte resultater', () => {
  afterAll(() => {
    app.close()
  })
  test('Skal returnere STOR SNERK som innlogget bruker', async () => {
    const res = await request(app).get(`${config.default.app.basePath}/api/person/innlogget`).expect(200)
    expect(res.body).toEqual(JSON.parse(JSON.stringify(STOR_SNERK)))
  })

  test('Skal returnere 200 ved innsending av soeknad', async () => {
    await request(app).post(`${config.default.app.basePath}/api/api/soeknad`).send({}).expect(200)
  })

  test('Skal lagre kladd', async () => {
    await request(app).post(`${config.default.app.basePath}/api/api/kladd`).expect(200)
  })

  test('Skal returnere lagret kladd', async () => {
    await request(app).get(`${config.default.app.basePath}/api/api/kladd`).expect(200)
  })

  test('Skal lagre kladd', async () => {
    await request(app).post(`${config.default.app.basePath}/api/api/kladd`).expect(200)
  })

  test('Skal slette kladd', async () => {
    await request(app).delete(`${config.default.app.basePath}/api/api/kladd`).expect(200)
    await request(app).get(`${config.default.app.basePath}/api/api/kladd`).expect(404)
  })

  test('Skal returnere alle land', async () => {
    const res = await request(app).get(`${config.default.app.basePath}/api/kodeverk/alleland`).expect(200)
    expect(res.body).toEqual(mockLand.default)
  })

  test('Skal returnere 3600 som gjenvaerende tid til utlogging', async () => {
    const res = await request(app).get(`${config.default.app.basePath}/oauth2/session`).expect(200)
    expect(res.text).toEqual('3600')
  })
})
