import { HttpService } from "@nestjs/axios";
import { FileProvider } from "../../../src/imdb/providers/file.provider";
import { LocationService } from "../../../src/imdb/services/location.service";

describe("LocationService", () => {
  const url = `https://www.imdb.com/title/tt0133093/`;

  let fileProvider: FileProvider;
  let httpService: HttpService;
  let locationService: LocationService;
  let locations: string[];

  beforeAll(async () => {
    httpService = new HttpService();
    fileProvider = new FileProvider(httpService);
    locationService = new LocationService(fileProvider);
    await locationService.loadContent(new URL(url));
    locations = await locationService.getLocations();
  });

  describe("getLocations", () => {
    it("should match locations length", async () => {
      expect(locations.length).toBeGreaterThanOrEqual(22);
    });

    it("should match locations content", async () => {
      expect(locations).toContain(
        "Redfern, Sydney, New South Wales, Australia"
      );
      expect(locations).toContain(
        "Hickson Road, Millers Point, Sydney, New South Wales, Australia"
      );
      expect(locations).toContain("Nashville, Tennessee, USA");
    });
  });
});
