import { Injectable } from "@nestjs/common";
import { Tape } from "./models/tape.model";
import { AbstractProvider } from "./providers/abstract.provider";

@Injectable()
export class ImdbService {
  constructor(private provider: AbstractProvider) {}
  
  createUrl(imdbNumber: number): string {
    const imdbID: string = `${imdbNumber}`.padStart(7, "0")

    return `https://www.imdb.com/title/tt${imdbID}/`
  }

  async getTape(imdbNumber: number): Promise<Tape> {
    const mainUrl = this.createUrl(imdbNumber)
    const htmlMain = await this.provider.get(mainUrl)
    console.log(htmlMain.length)
    return {} as any;
  }

  async importTape(imdbNumber: number): Promise<Tape> {
    return {} as any;
  }
}
