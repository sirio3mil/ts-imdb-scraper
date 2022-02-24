import { HttpService } from "@nestjs/axios";
import { EpisodeListItem } from "../../../src/imdb/models/scrapped/episode-list-item.model";
import { EpisodeListService } from "../../../src/imdb/services/episode-list.service";
import { FileProvider } from "../../../src/imdb/providers/file.provider";

describe("EpisodeListService", () => {
  let fileProvider: FileProvider;
  let httpService: HttpService;
  let episodeListService: EpisodeListService;

  beforeAll(async () => {
    httpService = new HttpService();
    fileProvider = new FileProvider(httpService);
    episodeListService = new EpisodeListService(fileProvider);
  });

  describe("get finished episode list items", () => {
    let items: EpisodeListItem[];

    beforeAll(async () => {
      const url = `https://www.imdb.com/title/tt0773262/`;
      const content = await episodeListService.setSeasonNumber(1).getContent(new URL(url));
      items = episodeListService.set$(content).getEpisodeListItems();
    });

    it("should match episode list items length", async () => {
      expect(items.length).toEqual(12);
    });

    it.each([
      [ 'Dexter', 785280, '2007-11-05T00:00:00.000Z' ],
      [ 'Born Free', 877058, '2006-12-17T00:00:00.000Z' ],
    ])
    ("should match %s episode content", async (title, imdbNumber, airDate) => {
      const episode = items.find((item) => item.title === title);
      expect(episode).not.toBeNull();
      expect(episode.airDate).toBeInstanceOf(Date);
      expect(episode.airDate.toISOString()).toEqual(airDate);
      expect(episode.imdbNumber).toEqual(imdbNumber);
      expect(episode.fullAirDate).toBeTruthy();
    });
  });

  describe("get future episode list items", () => {
    let items: EpisodeListItem[];

    beforeAll(async () => {
      const url = `https://www.imdb.com/title/tt7632118/`;
      const content = await episodeListService.getContent(new URL(url));
      items = episodeListService.set$(content).getEpisodeListItems();
    });

    it("should match default episode list items length", async () => {
      expect(items.length).toEqual(6);
    });

    it.each([
      [ 'Pink Clouds', 16740610 ],
      [ 'The Ride', 7641112 ],
    ])
    ("should match %s episode content", async (title, imdbNumber) => {
      const episode = items.find((item) => item.title === title);
      expect(episode).not.toBeNull();
      expect(episode.airDate).toBeUndefined();
      expect(episode.imdbNumber).toEqual(imdbNumber);
      expect(episode.fullAirDate).toBeFalsy();
    });

    it("should detect episode air date with only a year", async () => {
      const episode = items.find((item) => item.title === 'A Cosmic Alphabet');
      expect(episode).not.toBeNull();
      expect(episode.airDate).toBeInstanceOf(Date);
      expect(episode.airDate.toISOString()).toEqual('2022-01-01T00:00:00.000Z');
      expect(episode.imdbNumber).toEqual(11465826);
      expect(episode.fullAirDate).toBeFalsy();
    });
  });
});
