import { Injectable } from "@nestjs/common";
import { Tape } from "./models/tape.model";
import { AbstractProvider } from "./providers/abstract.provider";
import * as cheerio from "cheerio";
import { TapeDetail } from "./models/tape-detail.model";
import { GlobalUniqueObject } from "./models/guid.model";
import { Ranking } from "./models/ranking.model";
import { URL } from 'url';

@Injectable()
export class ImdbService {
  constructor(private provider: AbstractProvider) {}

  async getTape(imdbNumber: number): Promise<Tape> {
    const url = this.createUrl(imdbNumber);
    const tape = new Tape();
    tape.detail = new TapeDetail();
    tape.object = new GlobalUniqueObject();
    tape.object.imdbNumber = {
      imdbNumber,
      url: url.toString()
    };
    console.log(tape.object.imdbNumber.url)
    const [htmlMain, htmlCast] = await Promise.all([
      this.provider.get(url),
      this.provider.get(new URL('fullcredits', tape.object.imdbNumber.url))
    ]);
    const $ = cheerio.load(htmlMain);
    const titleBlock = $('[class^="TitleBlock__Container"]');
    this.setOriginalTitle(titleBlock, tape);
    this.setDuration(titleBlock, tape);
    this.setYear(titleBlock, tape);
    this.setBudget($, tape);
    this.setColors($, tape);
    this.setCountries($, tape);
    this.setGenres($, tape);
    this.setRanking($, tape);
    return tape;
  }

  private setRanking($: cheerio.Root, tape: Tape) {
    const ranking = new Ranking();
    ranking.calculatedScore = parseFloat($('[class^="AggregateRatingButton__RatingScore"]').first().text());
    const formattedVotes = $('[class^="AggregateRatingButton__TotalRatingAmount"]').first().text();
    if (formattedVotes.endsWith('M')) {
      ranking.votes = parseFloat(formattedVotes.replace(/[^0-9.]/g, '')) * 1000000;
      ranking.score = ranking.votes * ranking.calculatedScore;
    }
    tape.object.ranking = ranking;
  }

  private setCountries($: cheerio.Root, tape: Tape) {
    const detailsBlock = $('section').find('[data-testid="Details"]').find('.ipc-metadata-list__item');
    detailsBlock.each((i, elem) => {
      const label = $(elem).find('.ipc-metadata-list-item__label').text();
      if (label === "Countries of origin") {
        $(elem).find('.ipc-metadata-list-item__list-content-item').each((i, elem) => {
          tape.countries.push({
            officialName: $(elem).text()
          });
        });
      } else if (label === "Language") {
        $(elem).find('.ipc-metadata-list-item__list-content-item').each((i, elem) => {
          tape.languages.push({
            name: $(elem).text()
          });
        });
      }
    });
  }

  private setGenres($: cheerio.Root, tape: Tape) {
    const detailsBlock = $('section').find('[data-testid="Storyline"]').find('.ipc-metadata-list__item');
    detailsBlock.each((i, elem) => {
      const label = $(elem).find('.ipc-metadata-list-item__label').text();
      if (label === "Genres") {
        $(elem).find('.ipc-metadata-list-item__list-content-item').each((i, elem) => {
          tape.genres.push({
            name: $(elem).text()
          });
        });
      }
    });
  }

  private createUrl(imdbNumber: number): URL {
    const imdbID: string = `${imdbNumber}`.padStart(7, "0")

    return new URL(`title/tt${imdbID}/`, 'https://www.imdb.com')
  }

  private setOriginalTitle(titleBlock: cheerio.Cheerio, tape: Tape) {
    const originalTitle = titleBlock.find('[class^="OriginalTitle__OriginalTitleText"]');
    tape.originalTitle = originalTitle?.text()?.replace("Original title: ", "");
  }

  private setYear(titleBlock: cheerio.Cheerio, tape: Tape) {
    tape.detail.year = parseInt(titleBlock.find('[class^="TitleBlockMetaData__ListItemText"]').first().text());
  }

  private setDuration(titleBlock: cheerio.Cheerio, tape: Tape) {
    const formatedDuration = titleBlock.find('.ipc-inline-list__item').last()?.text();
    const durationParts = formatedDuration?.split(" ");
    tape.detail.duration = 0;
    durationParts.forEach((elem) => {
      if (elem.endsWith('h')) {
        tape.detail.duration += (parseInt(elem.replace(/[^0-9]/g, '')) * 60);
      } else if (elem.endsWith('min')) {
        tape.detail.duration += parseInt(elem.replace(/[^0-9]/g, ''));
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
      const label = $(elem).find('.ipc-metadata-list-item__label').text();
      if (label === "Budget") {
        tape.detail.budget = parseInt($(elem).find('.ipc-metadata-list-item__list-content-item').text()?.replace(/[^0-9]/g, ''));
      }
    });
  }

  async importTape(imdbNumber: number): Promise<Tape> {
    return {} as any;
  }
}
