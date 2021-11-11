import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import { URL } from "url";
import { AbstractProvider } from "../providers/abstract.provider";

@Injectable()
export abstract class HtmlService {
  constructor(protected provider: AbstractProvider) {}

  protected async load(url: URL): Promise<cheerio.Root> {
    const html = await this.provider.get(url);
    return cheerio.load(html);
  }

  protected createUrl(imdbNumber: number): URL {
    const imdbID: string = `${imdbNumber}`.padStart(7, "0");

    return new URL(`title/tt${imdbID}/`, "https://www.imdb.com");
  }
}
