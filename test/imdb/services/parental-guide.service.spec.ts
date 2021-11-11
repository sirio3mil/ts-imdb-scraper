import { HttpService } from "@nestjs/axios";
import { Certification } from "../../../src/imdb/models/certification.model";
import { FileProvider } from "../../../src/imdb/providers/file.provider";
import { ParentalGuideService } from "../../../src/imdb/services/parental-guide.service";

describe("ParentalGuideService", () => {
  const url = `https://www.imdb.com/title/tt0133093/`;

  let fileProvider: FileProvider;
  let httpService: HttpService;
  let parentalGuideService: ParentalGuideService;
  let certifications: Certification[];

  beforeAll(async () => {
    httpService = new HttpService();
    fileProvider = new FileProvider(httpService);
    parentalGuideService = new ParentalGuideService(fileProvider);
    await parentalGuideService.loadContent(new URL(url));
    certifications = await parentalGuideService.getCertifications();
  });

  describe("getCertifications", () => {
    it("should match certifications length", async () => {
      expect(certifications.length).toEqual(59);
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
