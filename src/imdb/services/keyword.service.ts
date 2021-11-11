import { Injectable } from "@nestjs/common";
import { URL } from "url";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class KeywordService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
  }

  async getKeywords(url: string): Promise<string[]> {
    const keywords = [];
    const $ = await this.load(new URL("keywords", url));
    const links = $('[href^="/search/keyword?keywords"]');
    links.each((i, link) => {
      keywords.push($(link).text());
    });

    return keywords;
  }
}
