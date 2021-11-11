import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import { AbstractProvider } from "../providers/abstract.provider";

@Injectable()
export abstract class HtmlService {
  protected $: cheerio.Root;
  protected page: string;

  constructor(protected provider: AbstractProvider) {}

  async getContent(url: URL): Promise<string> {
    return this.provider.get(this.page ? new URL(this.page, url) : url);
  }

  createUrl(imdbNumber: number): URL {
    const imdbID: string = `${imdbNumber}`.padStart(7, "0");

    return new URL(`title/tt${imdbID}/`, "https://www.imdb.com");
  }

  set$(content: string): this {
    this.$ = cheerio.load(content);
    return this;
  }
}
