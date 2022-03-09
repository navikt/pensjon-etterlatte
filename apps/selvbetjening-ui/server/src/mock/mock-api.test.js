import { jest } from '@jest/globals'
import request from 'supertest'
import config from '../config'
import mockLand from './landMock'
import app from './mock-server'
import { STOR_SNERK } from './mock-user'

describe('Test at mock-api gir korrekte resultater', () => {
  afterEach(() => {
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

  test('Skal returnere 1 time etter naavaerende tid som gjenvaerende tid til utlogging', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2017-01-01').getTime())
    const res = await request(app).get(`${config.default.app.basePath}/session`).expect(200)
    const date = new Date()
    date.setHours(date.getHours() + 1)
    expect(res.text).toEqual(date.getTime().toString())
  })
})
