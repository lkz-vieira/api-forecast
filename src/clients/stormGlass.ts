import { InternalError } from '@src/util/errors/internal-error';
import { AxiosStatic } from 'axios';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassResponse {
  hours: Array<StormGlassPoint>;
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class ClienteRequestError extends InternalError {
  constructor(message: string) {
    const InternalMessage = 'Unexpected error when trying to communicate to StormGlass';
    super(`${InternalMessage} : ${message}`);
  }
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISouce = 'noaa';
  constructor(readonly request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<Array<ForecastPoint>> {
    try {
      const response = await this.request.get<StormGlassResponse>(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISouce}`
      );
      return this.normalizedResponse(response.data);
    } catch (err) {
      throw new ClienteRequestError(err.message);
    }
  }

  private normalizedResponse(points: StormGlassResponse): Array<ForecastPoint> {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassAPISouce],
      swellHeight: point.swellHeight[this.stormGlassAPISouce],
      swellPeriod: point.swellPeriod[this.stormGlassAPISouce],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISouce],
      waveHeight: point.waveHeight[this.stormGlassAPISouce],
      windDirection: point.windDirection[this.stormGlassAPISouce],
      windSpeed: point.windSpeed[this.stormGlassAPISouce],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISouce] &&
      point.swellHeight?.[this.stormGlassAPISouce] &&
      point.swellPeriod?.[this.stormGlassAPISouce] &&
      point.waveDirection?.[this.stormGlassAPISouce] &&
      point.waveHeight?.[this.stormGlassAPISouce] &&
      point.windDirection?.[this.stormGlassAPISouce] &&
      point.windSpeed?.[this.stormGlassAPISouce]
    );
  }
}
