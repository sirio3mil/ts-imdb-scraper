import { Injectable } from "@nestjs/common";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class KeywordService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
    this.page = "keywords";
  }

  getKeywords(): string[] {
    const keywords = [];
    const links = this.$('[href^="/search/keyword?keywords"]');
    links.each((i, link) => {
      keywords.push(this.$(link).text());
    });

    return keywords;
  }
}
