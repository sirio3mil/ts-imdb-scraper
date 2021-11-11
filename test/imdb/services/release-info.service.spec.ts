import { HttpService } from "@nestjs/axios";
import { Premiere } from "../../../src/imdb/models/premiere.model";
import { Title } from "../../../src/imdb/models/title.model";
import { FileProvider } from "../../../src/imdb/providers/file.provider";
import { ReleaseInfoService } from "../../../src/imdb/services/release-info.service";

describe("ReleaseInfoService", () => {
  const url = `https://www.imdb.com/title/tt0133093/`;

  let fileProvider: FileProvider;
  let httpService: HttpService;
  let releaseInfoService: ReleaseInfoService;

  beforeAll(async () => {
    httpService = new HttpService();
    fileProvider = new FileProvider(httpService);
    releaseInfoService = new ReleaseInfoService(fileProvider);
    const content = await releaseInfoService.getContent(new URL(url));
    releaseInfoService.set$(content);
  });

  describe("getTitles", () => {
    let titles: Title[];

    beforeEach(async () => {
      titles = await releaseInfoService.getTitles();
    });

    it("should match titles length", async () => {
      expect(titles.length).toBeGreaterThanOrEqual(57);
    });

    it.each([
      [
        {
          title: "La matriz",
          country: "Panama",
          observations: "alternative",
        },
      ],
      [
        {
          title: "The Matrix",
          country: "Norway",
        },
      ],
      [
        {
          title: "The Matrix",
          observations: "original",
        },
      ],
      [
        {
          title: "マトリックス",
          country: "Japan",
          language: "Japanese",
        },
      ],
    ])("should match titles content", async (expected) => {
      expect(titles).toEqual(
        expect.arrayContaining([expect.objectContaining(expected)])
      );
    });
  });

  describe("getPremieres", () => {
    let premieres: Premiere[];
    const premiereTestCases = [
      {
        country: "USA",
        place: "Westwood, California",
        detail: "premiere",
      },
      {
        country: "USA",
      },
      {
        country: "Finland",
        detail: "Night Visions Film Festival",
      },
      {
        country: "Spain",
        place: "Barcelona",
        detail: "re-release",
      },
    ];

    beforeEach(async () => {
      premieres = await releaseInfoService.getPremieres();
    });

    it("should match premieres length", async () => {
      expect(premieres.length).toBeGreaterThanOrEqual(63);
    });

    it.each(
      premiereTestCases.map((premiere) => [
        premiere.place || premiere.country,
        premiere,
      ])
    )("should match premieres content %s", async (label, expected) => {
      expect(premieres).toEqual(
        expect.arrayContaining([expect.objectContaining(expected)])
      );
    });

    it.each([["1999-06-22"], ["2012-05-04"]])(
      "should match premieres date %s",
      async (date) => {
        const dates = premieres
          .filter((premiere) => premiere.country === "Spain")
          .map((premiere) => premiere.date.toISOString());
        expect(dates).toEqual(
          expect.arrayContaining([expect.stringContaining(date)])
        );
      }
    );
  });
});
