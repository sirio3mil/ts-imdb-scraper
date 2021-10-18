import { Injectable } from "@nestjs/common";
import { Tape } from "./models/tape.model";
import { AbstractProvider } from "./providers/abstract.provider";
import * as cheerio from "cheerio";

@Injectable()
export class ImdbService {
  constructor(private provider: AbstractProvider) {}
  
  createUrl(imdbNumber: number): string {
    const imdbID: string = `${imdbNumber}`.padStart(7, "0")

    return `https://www.imdb.com/title/tt${imdbID}/`
  }

  async getTape(imdbNumber: number): Promise<Tape> {
    const tape = new Tape()
    const mainUrl = this.createUrl(imdbNumber);
    const htmlMain = await this.provider.get(mainUrl);
    const $ = cheerio.load(htmlMain);
    const originalTitle = $('[class^="OriginalTitle__OriginalTitleText"]');
    tape.originalTitle = originalTitle?.text()?.replace("Original title: ", "");
    return tape;
  }

  async importTape(imdbNumber: number): Promise<Tape> {
    return {} as any;
  }
}
