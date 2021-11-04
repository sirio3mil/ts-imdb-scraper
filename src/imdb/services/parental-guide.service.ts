import { Injectable } from "@nestjs/common";
import { URL } from "url";
import { Certification } from "../models/certification.model";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class ParentalGuideService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
  }

  async getCertifications(url: string): Promise<Certification[]> {
    const certifications = [];
    const $ = await this.load(new URL("parentalguide", url));
    const links = $('[href^="/search/title?certificates"]');
    links.each((i, link) => {
      const [country, certification] = $(link).text().split(':');
      certifications.push({
        country,
        certification
      });
    });

    return certifications;
  }
}
