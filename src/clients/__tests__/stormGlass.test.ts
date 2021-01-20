import { StormGlass } from '@src/clients/stormGlass'
import stormGlassWeather3HoursFixture from '@test/fixture/stormglass_weather_3_hours.json'
import stormNormalizedGlassWeather3HoursFixture from '@test/fixture/stormglass_normalized_weather_3_hours.json'

import axios from 'axios'

jest.mock('axios')

describe('StormGlass Client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  test('Verifica se esta retornando uma previsão normalizada do Serviço StormGlass', async () => {
    const lat = 33.77216
    const lng = 151.2924

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture })

    const stormGlass = new StormGlass(mockedAxios)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormNormalizedGlassWeather3HoursFixture)
  })

  test('Excluir dados incompletos de Points', async () => {
    const lat = -33.792726
    const lng = 151.28898
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    }

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse })
    const stormGlass = new StormGlass(mockedAxios)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual([])
  })

  test('Espera erro na comunicação com o serviço StormGlass', async () => {
    const lat = -33.792726
    const lng = 151.28898

    mockedAxios.get.mockRejectedValue({ message: 'Network Error' })
    const stormGlass = new StormGlass(mockedAxios)

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass'
    )
  })
})
