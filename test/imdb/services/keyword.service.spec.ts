import { HttpService } from "@nestjs/axios";
import { FileProvider } from "../../../src/imdb/providers/file.provider";
import { KeywordService } from "../../../src/imdb/services/keyword.service";

describe("KeywordService", () => {
  const url = `https://www.imdb.com/title/tt0133093/`;

  let fileProvider: FileProvider;
  let httpService: HttpService;
  let keywordService: KeywordService;
  let keywords: string[];

  beforeAll(async () => {
    httpService = new HttpService();
    fileProvider = new FileProvider(httpService);
    keywordService = new KeywordService(fileProvider);
    keywords = await keywordService.getKeywords(url);
  });

  describe("getKeywords", () => {
    it("should match keywords length", async () => {
      expect(keywords.length).toBeGreaterThanOrEqual(359);
    });

    it("should match keywords content", async () => {
      expect(keywords).toContain("prophecy");
      expect(keywords).toContain("human as resource");
      expect(keywords).toContain("altered version of studio logo");
    });
  });
});
