import { Beach } from '@src/models/beach'

describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany({}))
  describe('When creating a new Beach', () => {
    test('Should create a beach with success', async () => {
      const newBeach = {
        lat: -33.7972,
        lng: 151.2899,
        name: 'Manly',
        position: 'E'
      }

      const response = await global.testRequest.post('/beaches').send(newBeach)
      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newBeach))
    })
  })
})
