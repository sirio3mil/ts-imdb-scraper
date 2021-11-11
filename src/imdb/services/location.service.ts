import { Injectable } from "@nestjs/common";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class LocationService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
    this.page = "locations";
  }

  getLocations(): string[] {
    const locations = [];
    const links = this.$('[href^="/search/title?locations"]');
    links.each((i, location) => {
      locations.push(this.$(location).text());
    });

    return locations;
  }
}
