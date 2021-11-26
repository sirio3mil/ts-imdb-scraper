import { Injectable } from "@nestjs/common";
import { ScrappedCertification } from "../models/certification.model";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class ParentalGuideService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
    this.page = "parentalguide";
  }

  getCertifications(): ScrappedCertification[] {
    const certifications = [];
    const links = this.$('[href^="/search/title?certificates"]');
    links.each((i, link) => {
      const [country, certification] = this.$(link).text().split(":");
      certifications.push({
        country,
        certification,
      });
    });

    return certifications;
  }
}
