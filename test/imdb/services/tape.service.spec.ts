import { HttpService } from "@nestjs/axios";
import { Tape } from "../../../src/imdb/models/tape.model";
import { FileProvider } from "../../../src/imdb/providers/file.provider";
import { TapeService } from "../../../src/imdb/services/tape.service";

describe("TapeService", () => {
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

  describe("getTape", () => {
    it("should match ranking", async () => {
      expect(tape.ranking.calculatedScore).toBeCloseTo(8.7, 1);
      expect(tape.ranking.votes).toBeGreaterThanOrEqual(1800000);
      expect(tape.ranking.score).toBe(
        tape.ranking.calculatedScore * tape.ranking.votes
      );
    });

    it.each([
      ["budget", 63000000],
      ["colors", ["Color"]],
      ["languages", ["English"]],
      ["countries", ["United States", "Australia"]],
      ["sounds", ["Dolby Digital", "SDDS", "Dolby Atmos"]],
      ["genres", ["Action", "Sci-Fi"]],
      ["duration", 136],
      ["year", 1999],
      ["ID", tapeID],
      ["url", "https://www.imdb.com/title/tt0133093/"],
      ["originalTitle", "The Matrix"],
    ])("should match %s", async (prop, expected) => {
      expect(tape[prop]).toEqual(expected);
    });

    it.each([["credits"], ["premieres"], ["titles"]])(
      "should have undefined %s",
      async (prop) => {
        expect(tape[prop]).toBeUndefined();
      }
    );
  });
});
