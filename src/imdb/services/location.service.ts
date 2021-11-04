import { Injectable } from "@nestjs/common";
import { URL } from "url";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class LocationService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
  }

  async getLocations(url: string): Promise<string[]> {
    const locations = [];
    const $ = await this.load(new URL("locations", url));
    const links = $('[href^="/search/title?locations"]');
    links.each((i, location) => {
      locations.push($(location).text());
    });

    return locations;
  }
}
