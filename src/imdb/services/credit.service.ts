import { Injectable } from "@nestjs/common";
import { Constants } from "../../config/constants";
import { ScrappedCredit } from "../models/scrapped/credit.model";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class CreditService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
    this.page = "fullcredits";
  }

  getCredits(): ScrappedCredit[] {
    const credits = [];
    const titles = this.$("#fullcredits_content").find("h4");
    titles.each((i, title) => {
      const table = this.$(title).next("table");
      const simpleCreditsTable = table.hasClass("simpleCreditsTable");
      const rows = table.find("tr");
      const role = this.$(title).attr("id");
      if (!Constants.roles[role]) {
        return;
      }
      rows.each((i, row) => {
        const cells = this.$(row).find("td");
        const nameCellPosition = simpleCreditsTable ? 0 : 1;
        const nameCell = cells.eq(nameCellPosition);
        const href = nameCell.find("a").attr("href");
        const id = parseInt(href?.match(/nm([\d]+)/)[1]);
        if (!!id) {
          const url = new URL(href, "https://www.imdb.com");
          const fullName = nameCell.text().trim();
          const characterCell = cells.last();
          let character = characterCell.text()?.trim();
          let alias = null;
          const matchs = character?.match(/\(as ([\w\s]+)\)/);
          if (matchs?.length) {
            character = character.replace(matchs[0], "").trim();
            alias = matchs[1];
          }
          if (Constants.roles[role] !== Constants.roles.cast) {
            character = null;
          }
          credits.push({
            person: {
              fullName,
              alias,
              ID: id,
              url,
            },
            role,
            character,
          });
        }
      });
    });

    return credits;
  }
}
