import { HttpService } from "@nestjs/axios";
import { ScrappedCredit } from "../../../src/imdb/models/scrapped/credit.model";
import { FileProvider } from "../../../src/imdb/providers/file.provider";
import { CreditService } from "../../../src/imdb/services/credit.service";

describe("CreditService", () => {
  const url = `https://www.imdb.com/title/tt0133093/`;

  let fileProvider: FileProvider;
  let httpService: HttpService;
  let creditService: CreditService;
  let credits: ScrappedCredit[];

  beforeAll(async () => {
    httpService = new HttpService();
    fileProvider = new FileProvider(httpService);
    creditService = new CreditService(fileProvider);
    const content = await creditService.getContent(new URL(url));
    credits = creditService.set$(content).getCredits();
  });

  describe("getCredits", () => {
    it("should match credits length", async () => {
      expect(credits.length).toEqual(45);
    });

    it("should match directors", async () => {
      const directors = credits.filter((credit) => credit.role === "director");

      expect(directors.length).toEqual(2);
      expect(directors[0].person.fullName).toEqual("Lana Wachowski");
      expect(directors[0].person.alias).toEqual("The Wachowski Brothers");
      expect(directors[0].person.ID).toEqual(905154);
      expect(directors[1].person.fullName).toEqual("Lilly Wachowski");
    });

    it("should match writers", async () => {
      const writers = credits.filter((credit) => credit.role === "writer");

      expect(writers.length).toEqual(2);
      expect(writers[1].person.fullName).toEqual("Lana Wachowski");
      expect(writers[1].person.alias).toEqual("The Wachowski Brothers");
      expect(writers[1].person.ID).toEqual(905154);
      expect(writers[0].person.fullName).toEqual("Lilly Wachowski");
      expect(writers[0].character).toBeNull();
    });

    it("should match cast", async () => {
      const cast = credits.filter((credit) => credit.role === "cast");
      expect(cast.length).toEqual(41);

      const keanuReeves = cast.find((credit) => credit.person.fullName === "Keanu Reeves");
      expect(keanuReeves).not.toBeNull();
      expect(keanuReeves.person.alias).toBeNull();
      expect(keanuReeves.person.ID).toEqual(206);
      expect(keanuReeves.character).toEqual("Neo");

      const bernardLedger = cast.find((credit) => credit.person.fullName === "Bernard Ledger");
      expect(bernardLedger).not.toBeNull();
      expect(bernardLedger.person.alias).toEqual("Bernie Ledger");
      expect(bernardLedger.person.ID).toEqual(496567);
      expect(bernardLedger.character).toEqual("Big Cop");
    });
  });
});
