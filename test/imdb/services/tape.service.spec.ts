import { HttpService } from "@nestjs/axios";
import { Tape } from "../../../src/imdb/models/tape.model";
import { FileProvider } from "../../../src/imdb/providers/file.provider";
import { TapeService } from "../../../src/imdb/services/tape.service";

describe('TapeService', () => {
  const tapeID = 133093;

  let fileProvider: FileProvider;
  let httpService: HttpService;
  let tapeService: TapeService;
  let tape: Tape;

  beforeAll(async () => {
    httpService = new HttpService();
    fileProvider = new FileProvider(httpService);
    tapeService = new TapeService(fileProvider);
    tape = await tapeService.getTape(tapeID);
  });

  describe('getTape', () => {

    it('should match original title', async () => {
      expect(tape.originalTitle).toBe('The Matrix');
    });

    it('should match ranking', async () => {
      expect(tape.ranking.calculatedScore).toBeCloseTo(8.7, 1);
      expect(tape.ranking.votes).toBeGreaterThanOrEqual(1800000);
      expect(tape.ranking.score).toBe(tape.ranking.calculatedScore * tape.ranking.votes);
    });

    it('should match imdb', async () => {
      expect(tape.ID).toBe(tapeID);
      expect(tape.url).toBe('https://www.imdb.com/title/tt0133093/');
    });

    it('should match year', async () => {
      expect(tape.year).toBe(1999);
    });

    it('should match duration', async () => {
      expect(tape.duration).toBe(136);
    });

    it('should match genres', async () => {
      expect(tape.genres).toEqual(['Action', 'Sci-Fi']);
    });

    it('should match countries', async () => {
      expect(tape.countries).toEqual(['United States', 'Australia']);
    });

    it('should match languages', async () => {
      expect(tape.languages).toEqual(['English']);
    });

    it('should match colors', async () => {
      expect(tape.colors).toEqual(['Color']);
    });

    it('should match budget', async () => {
      expect(tape.budget).toEqual(['Color']);
    });

    it('should have empty values', async () => {
      expect(tape.credits).toEqual([]);
      expect(tape.premieres).toEqual([]);
      expect(tape.titles).toEqual([]);
    });

  });
});
