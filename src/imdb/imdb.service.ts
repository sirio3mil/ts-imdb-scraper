import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import { URL } from "url";
import { Country } from "./models/country.model";
import { Ranking } from "./models/ranking.model";
import { TapeDetail } from "./models/tape-detail.model";
import { Tape } from "./models/tape.model";
import { AbstractProvider } from "./providers/abstract.provider";

@Injectable()
export class ImdbService {
  constructor(private provider: AbstractProvider) {}

  async getTape(imdbNumber: number): Promise<Tape> {
    const url = this.createUrl(imdbNumber);
    const tape = new Tape();
    tape.detail = new TapeDetail();
    tape.imdb = {
      ID: imdbNumber,
      url: url.toString(),
    };
    const [home, fullCredits, releaseInfo] = await Promise.all([
      this.provider.get(url),
      this.provider.get(new URL("fullcredits", tape.imdb.url)),
      this.provider.get(new URL("releaseinfo", tape.imdb.url)),
    ]);
    this.setHomeContent(home, tape);
    this.setFullCreditsContent(fullCredits, tape);
    this.setReleaseInfoContent(releaseInfo, tape);
    return tape;
  }

  private setReleaseInfoContent(html: string, tape: Tape) {
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
      tape.premieres.push({
        country,
        date: new Date(date),
        detail,
        place
      })
    });
  }

  private setFullCreditsContent(html: string, tape: Tape) {
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
          tape.credits.push({
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
  }

  private setHomeContent(html: string, tape: Tape) {
    const $ = cheerio.load(html);
    const titleBlock = $('[class^="TitleBlock__Container"]');
    this.setOriginalTitle(titleBlock, tape);
    this.setDuration(titleBlock, tape);
    this.setYear(titleBlock, tape);
    this.setBudget($, tape);
    this.setColors($, tape);
    this.setCountries($, tape);
    this.setGenres($, tape);
    this.setRanking($, tape);
  }

  private setRanking($: cheerio.Root, tape: Tape) {
    const ranking = new Ranking();
    ranking.calculatedScore = parseFloat(
      $('[class^="AggregateRatingButton__RatingScore"]').first().text()
    );
    const formattedVotes = $(
      '[class^="AggregateRatingButton__TotalRatingAmount"]'
    )
      .first()
      .text();
    if (formattedVotes.endsWith("M")) {
      ranking.votes =
        parseFloat(formattedVotes.replace(/[^0-9.]/g, "")) * 1000000;
      ranking.score = ranking.votes * ranking.calculatedScore;
    }
    tape.ranking = ranking;
  }

  private setCountries($: cheerio.Root, tape: Tape) {
    const detailsBlock = $("section")
      .find('[data-testid="Details"]')
      .find(".ipc-metadata-list__item");
    detailsBlock.each((i, elem) => {
      const label = $(elem).find(".ipc-metadata-list-item__label").text();
      if (label === "Countries of origin") {
        $(elem)
          .find(".ipc-metadata-list-item__list-content-item")
          .each((i, elem) => {
            tape.countries.push({
              officialName: $(elem).text(),
            });
          });
      } else if (label === "Language") {
        $(elem)
          .find(".ipc-metadata-list-item__list-content-item")
          .each((i, elem) => {
            tape.languages.push({
              name: $(elem).text(),
            });
          });
      }
    });
  }

  private setGenres($: cheerio.Root, tape: Tape) {
    const detailsBlock = $("section")
      .find('[data-testid="Storyline"]')
      .find(".ipc-metadata-list__item");
    detailsBlock.each((i, elem) => {
      const label = $(elem).find(".ipc-metadata-list-item__label").text();
      if (label === "Genres") {
        $(elem)
          .find(".ipc-metadata-list-item__list-content-item")
          .each((i, elem) => {
            tape.genres.push({
              name: $(elem).text(),
            });
          });
      }
    });
  }

  private createUrl(imdbNumber: number): URL {
    const imdbID: string = `${imdbNumber}`.padStart(7, "0");

    return new URL(`title/tt${imdbID}/`, "https://www.imdb.com");
  }

  private setOriginalTitle(titleBlock: cheerio.Cheerio, tape: Tape) {
    const originalTitle = titleBlock.find(
      '[class^="OriginalTitle__OriginalTitleText"]'
    );
    tape.originalTitle = originalTitle?.text()?.replace("Original title: ", "");
  }

  private setYear(titleBlock: cheerio.Cheerio, tape: Tape) {
    tape.detail.year = parseInt(
      titleBlock
        .find('[class^="TitleBlockMetaData__ListItemText"]')
        .first()
        .text()
    );
  }

  private setDuration(titleBlock: cheerio.Cheerio, tape: Tape) {
    const formatedDuration = titleBlock
      .find(".ipc-inline-list__item")
      .last()
      ?.text();
    const durationParts = formatedDuration?.split(" ");
    tape.detail.duration = 0;
    durationParts.forEach((elem) => {
      if (elem.endsWith("h")) {
        tape.detail.duration += parseInt(elem.replace(/[^0-9]/g, "")) * 60;
      } else if (elem.endsWith("min")) {
        tape.detail.duration += parseInt(elem.replace(/[^0-9]/g, ""));
      }
    });
  }

  private setColors($: cheerio.Root, tape: Tape) {
    const colors = $('[href^="/search/title/?colors"]');
    colors.each((i, elem) => {
      tape.detail.colors.push($(elem).text());
    });
  }

  private setBudget($: cheerio.Root, tape: Tape) {
    const boxOfficeItems = $('[class*="BoxOffice__MetaDataListItemBoxOffice"]');
    boxOfficeItems.each((i, elem) => {
      const label = $(elem).find(".ipc-metadata-list-item__label").text();
      if (label === "Budget") {
        tape.detail.budget = parseInt(
          $(elem)
            .find(".ipc-metadata-list-item__list-content-item")
            .text()
            ?.replace(/[^0-9]/g, "")
        );
      }
    });
  }

  async importTape(imdbNumber: number): Promise<Tape> {
    return {} as any;
  }
}
