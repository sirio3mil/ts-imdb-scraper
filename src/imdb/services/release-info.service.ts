import { Injectable } from "@nestjs/common";
import { ScrappedPremiere } from "../models/scrapped/premiere.model";
import { ScrappedTitle } from "../models/scrapped/title.model";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class ReleaseInfoService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
    this.page = "releaseinfo";
  }

  getPremieres(): ScrappedPremiere[] {
    const premieres = [];
    this.$(".release-date-item").each((i, row) => {
      const item = this.$(row);
      const country = item.find(".release-date-item__country-name").text();
      const date = new Date(item.find(".release-date-item__date").text());
      const details = item.find(".release-date-item__attributes").text();
      const regExp = /\(([^)]+)\)/g;
      const matches = details.match(regExp);
      let detail: string, place: string;
      if (matches?.length === 1) {
        detail = matches[0].substring(1, matches[0].length - 1);
      } else if (matches?.length === 2) {
        detail = matches[1].substring(1, matches[1].length - 1);
        place = matches[0].substring(1, matches[0].length - 1);
      }
      date.setUTCHours(0,0,0,0);
      premieres.push({
        country,
        date,
        detail,
        place,
      });
    });

    return premieres;
  }

  getTitles(): ScrappedTitle[] {
    const titles = [];
    this.$(".aka-item").each((i, row) => {
      const item = this.$(row);
      const title = item.find(".aka-item__title").text();
      const details = item.find(".aka-item__name").text();
      const regExp = /\(([^)]+)\)/g;
      const matches = details.match(regExp);
      let country: string, language: string, observations: string;
      if (matches?.length === 1) {
        const content = matches[0]
          .substring(1, matches[0].length - 1)
          .replace("title", "")
          .trim();
        if (content.charAt(0) === content.charAt(0).toUpperCase()) {
          language = content;
        } else {
          observations = content;
        }
        const name = details.replace(matches[0], "").trim();
        if (!!name) {
          country = name;
        }
      } else {
        country = details;
      }
      titles.push({
        country,
        language,
        title,
        observations,
      });
    });

    return titles;
  }
}
