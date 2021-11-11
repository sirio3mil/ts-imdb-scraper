import { HttpService } from "@nestjs/axios";
import { FileProvider } from "../../../src/imdb/providers/file.provider";
import { TapeService } from "../../../src/imdb/services/tape.service";

describe("TapeService", () => {
  const tapeID = 133093;

  let fileProvider: FileProvider;
  let httpService: HttpService;
  let tapeService: TapeService;

  beforeAll(async () => {
    httpService = new HttpService();
    fileProvider = new FileProvider(httpService);
    tapeService = new TapeService(fileProvider);
    await tapeService.loadContent(tapeService.createUrl(tapeID));
  });

  describe("getTape", () => {
    it("should match ranking", () => {
      const ranking = tapeService.getRanking();
      expect(ranking.calculatedScore).toBeCloseTo(8.7, 1);
      expect(ranking.votes).toBeGreaterThanOrEqual(1800000);
      expect(ranking.score).toBe(ranking.calculatedScore * ranking.votes);
    });

    it("should match budget", () => {
      const budget = tapeService.getBudget();
      expect(budget).toEqual(63000000);
    });

    it("should match colors", () => {
      const colors = tapeService.getColors();
      expect(colors).toEqual(["Color"]);
    });

    it("should match languages", () => {
      const languages = tapeService.getLanguages();
      expect(languages).toEqual(["English"]);
    });

    it("should match countries", () => {
      const countries = tapeService.getCountries();
      expect(countries).toEqual(["United States", "Australia"]);
    });

    it("should match sounds", () => {
      const sounds = tapeService.getSounds();
      expect(sounds).toEqual(["Dolby Digital", "SDDS", "Dolby Atmos"]);
    });

    it("should match genres", () => {
      const genres = tapeService.getGenres();
      expect(genres).toEqual(["Action", "Sci-Fi"]);
    });

    it("should match year", () => {
      const year = tapeService.getYear();
      expect(year).toEqual(1999);
    });

    it("should match duration", () => {
      const duration = tapeService.getDuration();
      expect(duration).toEqual(136);
    });

    it("should match originalTitle", () => {
      const originalTitle = tapeService.getOriginalTitle();
      expect(originalTitle).toEqual("The Matrix");
    });
  });
});
