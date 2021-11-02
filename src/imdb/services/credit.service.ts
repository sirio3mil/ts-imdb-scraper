import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import { URL } from "url";
import { Credit } from "../models/credit.model";
import { AbstractProvider } from "../providers/abstract.provider";

@Injectable()
export class CreditService {
  constructor(private provider: AbstractProvider) {}

  async getCredits(url: string): Promise<Credit[]> {
    const html = await this.provider.get(new URL("fullcredits", url))
    return this.getCreditsContent(html)
  }

  private getCreditsContent(html: string) : Credit[]{
    const credits = []
    const $ = cheerio.load(html.replace(/(\r\n|\n|\r)/gm, ""));
    const titles = $("#fullcredits_content").find("h4");
    titles.each((i, title) => {
      const table = $(title).next("table");
      const simpleCreditsTable = table.hasClass("simpleCreditsTable");
      const rows = table.find("tr");
      const role = $(title).attr("id");
      rows.each((i, row) => {
        const cells = $(row).find("td");
        const nameCellPosition = simpleCreditsTable ? 0 : 1;
        const nameCell = cells.eq(nameCellPosition);
        const href = nameCell.find("a").attr("href");
        const id = parseInt(href?.match(/nm([\d]+)/)[1]);
        if (!!id) {
          const url = new URL(href, "https://www.imdb.com");
          const fullName = nameCell.text().trim();
          const lastCell = cells.last();
          let character = lastCell.find("a").text();
          const matchs = lastCell
            .text()
            .replace(character, "")
            .match(/\(as ([\w\s]+)\)/);
          if (!character) character = null;
          const alias = !!matchs ? matchs[1] : null;
          credits.push({
            person: {
              fullName,
              alias,
              imdb: {
                ID: id,
                url: url.toString().replace(url.search, ""),
              },
            },
            role,
            character,
          });
        }
      });
    });

    return credits
  }
}
