import { Injectable } from "@nestjs/common";
import { URL } from "url";
import { Country } from "../models/country.model";
import { Language } from "../models/language.model";
import { Premiere } from "../models/premiere.model";
import { Title } from "../models/title.model";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class ReleaseInfoService extends HtmlService{
  constructor(protected provider: AbstractProvider) {
    super(provider);
  }

  async getPremieres(url: string): Promise<Premiere[]> {
    const premieres = []
    const $ = await this.load(new URL("releaseinfo", url))
    $(".release-date-item").each((i, row) => {
      const row$ = $(row)
      const country = new Country(row$.find('.release-date-item__country-name').text());
      const date = row$.find('.release-date-item__date').text();
      const details = row$.find('.release-date-item__attributes').text();
      const regExp = /\(([^)]+)\)/g;
      const matches = details.match(regExp);
      let detail: string, place: string
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

  async getTitles(url: string): Promise<Title[]> {
    const titles = []
    const $ = await this.load(new URL("releaseinfo", url))
    $(".aka-item").each((i, row) => {
      const row$ = $(row)
      const title = row$.find('.aka-item__title').text();
      const details = row$.find('.aka-item__name').text();
      const regExp = /\(([^)]+)\)/g;
      const matches = details.match(regExp);
      let country: Country, language: Language, observations: string
      if (matches?.length === 1) {
        const content = matches[0].substring(1, matches[0].length - 1).replace('title', '').trim();
        if (content.charAt(0) === content.charAt(0).toUpperCase()){
          language = new Language(content)
        } else {
          observations = content
        }
        const name = details.replace(matches[0], '').trim()
        if (!!name) {
          country = new Country(name)
        }
      } else {
        country = new Country(details)
      }
      titles.push({
        country,
        language,
        title,
        observations
      })
    });

    return titles
  }
}
