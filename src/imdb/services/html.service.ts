import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import { URL } from "url";
import { AbstractProvider } from "../providers/abstract.provider";

@Injectable()
export abstract class HtmlService {
  constructor(protected provider: AbstractProvider) {}

  protected async load(url: URL): Promise<cheerio.Root> {
    const html = await this.provider.get(url)
    return cheerio.load(html);
  }
}
