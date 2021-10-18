import { Injectable } from "@nestjs/common";
import { Tape } from "./models/tape.model";
import { AbstractProvider } from "./providers/abstract.provider";
import * as cheerio from "cheerio";
import { TapeDetail } from "./models/tape-detail.model";

@Injectable()
export class ImdbService {
  constructor(private provider: AbstractProvider) {}

  async getTape(imdbNumber: number): Promise<Tape> {
    const tape = new Tape();
    tape.detail = new TapeDetail();
    const mainUrl = this.createUrl(imdbNumber);
    const htmlMain = await this.provider.get(mainUrl);
    const $ = cheerio.load(htmlMain);
    const titleBlock = $('[class^="TitleBlock__Container"]');
    this.setOriginalTitle(titleBlock, tape);
    this.setDuration(titleBlock, tape);
    this.setYear(titleBlock, tape);
    this.setBudget($, tape);
    this.setColors($, tape);
    return tape;
  }

  private createUrl(imdbNumber: number): string {
    const imdbID: string = `${imdbNumber}`.padStart(7, "0")

    return `https://www.imdb.com/title/tt${imdbID}/`
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
