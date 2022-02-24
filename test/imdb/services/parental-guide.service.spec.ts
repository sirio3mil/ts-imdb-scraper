import { HttpService } from "@nestjs/axios";
import { ScrappedCertification } from "../../../src/imdb/models/scrapped/certification.model";
import { FileProvider } from "../../../src/imdb/providers/file.provider";
import { ParentalGuideService } from "../../../src/imdb/services/parental-guide.service";

describe("ParentalGuideService", () => {
  const url = `https://www.imdb.com/title/tt0133093/`;

  let fileProvider: FileProvider;
  let httpService: HttpService;
  let parentalGuideService: ParentalGuideService;
  let certifications: ScrappedCertification[];

  beforeAll(async () => {
    httpService = new HttpService();
    fileProvider = new FileProvider(httpService);
    parentalGuideService = new ParentalGuideService(fileProvider);
    const content = await parentalGuideService.getContent(new URL(url));
    certifications = parentalGuideService.set$(content).getCertifications();
  });

  describe("getCertifications", () => {
    it("should match certifications length", async () => {
      expect(certifications.length).toBeGreaterThan(50);
    });

    it("should match certifications", async () => {
      expect(certifications).toContainEqual({
        certification: "13",
        country: "Argentina",
      });
      expect(certifications).toContainEqual({
        certification: "Tous publics avec avertissement",
        country: "France",
      });
    });
  });
});
