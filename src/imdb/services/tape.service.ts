import { Injectable } from "@nestjs/common";
import { URL } from "url";
import { Ranking } from "../models/ranking.model";
import { Tape } from "../models/tape.model";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class TapeService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
  }

  async getTape(imdbNumber: number): Promise<Tape> {
    const url = this.createUrl(imdbNumber);
    const tape = new Tape();
    tape.ID = imdbNumber;
    tape.url = url.href;
    const $ = await this.load(url);
    const titleBlock = $('[class^="TitleBlock__Container"]');
    this.setOriginalTitle(titleBlock, tape);
    this.setDuration(titleBlock, tape);
    this.setYear(titleBlock, tape);
    this.setBudget($, tape);
    this.setColors($, tape);
    this.setCountries($, tape);
    this.setGenres($, tape);
    this.setRanking($, tape);
    this.setSounds($, tape);
    return tape;
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
    } else if (formattedVotes.endsWith("K")) {
      ranking.votes = parseFloat(formattedVotes.replace(/[^0-9.]/g, "")) * 1000;
    }
    if (!!ranking.votes) {
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
        tape.countries = [];
        $(elem)
          .find(".ipc-metadata-list-item__list-content-item")
          .each((i, elem) => {
            tape.countries.push($(elem).text());
          });
      } else if (label === "Language") {
        tape.languages = [];
        $(elem)
          .find(".ipc-metadata-list-item__list-content-item")
          .each((i, elem) => {
            tape.languages.push($(elem).text());
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
        tape.genres = [];
        $(elem)
          .find(".ipc-metadata-list-item__list-content-item")
          .each((i, elem) => {
            tape.genres.push($(elem).text());
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
    tape.year = parseInt(
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
    tape.duration = 0;
    durationParts.forEach((elem) => {
      if (elem.endsWith("h")) {
        tape.duration += parseInt(elem.replace(/[^0-9]/g, "")) * 60;
      } else if (elem.endsWith("min")) {
        tape.duration += parseInt(elem.replace(/[^0-9]/g, ""));
      }
    });
  }

  private setColors($: cheerio.Root, tape: Tape) {
    const colors = $('[href^="/search/title/?colors"]');
    if (!!colors.length) {
      tape.colors = [];
      colors.each((i, elem) => {
        tape.colors.push($(elem).text());
      });
    }
  }

  private setSounds($: cheerio.Root, tape: Tape) {
    const sounds = $('[href^="/search/title/?sound_mixes"]');
    if (!!sounds.length) {
      tape.sounds = [];
      sounds.each((i, elem) => {
        tape.sounds.push($(elem).text());
      });
    }
  }

  private setBudget($: cheerio.Root, tape: Tape) {
    const boxOfficeItems = $('[class*="BoxOffice__MetaDataListItemBoxOffice"]');
    boxOfficeItems.each((i, elem) => {
      const label = $(elem).find(".ipc-metadata-list-item__label").text();
      if (label === "Budget") {
        tape.budget = parseInt(
          $(elem)
            .find(".ipc-metadata-list-item__list-content-item")
            .text()
            ?.replace(/[^0-9]/g, "")
        );
      }
    });
  }
}
