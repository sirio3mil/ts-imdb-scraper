import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import { URL } from "url";
import { Country } from "../models/country.model";
import { Premiere } from "../models/premiere.model";
import { AbstractProvider } from "../providers/abstract.provider";

@Injectable()
export class PremiereService {
  constructor(private provider: AbstractProvider) {}

  async getPremieres(url: string): Promise<Premiere[]> {
    const html = await this.provider.get(new URL("releaseinfo", url))
    return this.getPremieresContent(html)
  }

  private getPremieresContent(html: string): Premiere[] {
    const premieres = []
    const $ = cheerio.load(html.replace(/(\r\n|\n|\r)/gm, ""));
    $(".release-date-item").each((i, row) => {
      const country = new Country($(row).find('.release-date-item__country-name').text());
      const date = $(row).find('.release-date-item__date').text();
      const details = $(row).find('.release-date-item__attributes').text();
      const regExp = /\(([^)]+)\)/g;
      const matches = details.match(regExp);
      let detail, place: string
      if (matches?.length === 1) {
        detail = matches[0].substring(1, matches[0].length - 1)
      } else if (matches?.length === 2) {
        detail = matches[1].substring(1, matches[1].length - 1)
        place = matches[0].substring(1, matches[0].length - 1)
      }
      premieres.push({
        country,
        date: new Date(date),
        detail,
        place
      })
    });

    return premieres
  }
}
