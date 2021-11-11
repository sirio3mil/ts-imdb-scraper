import { Injectable } from "@nestjs/common";
import { Ranking } from "../models/ranking.model";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class TapeService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
  }

  getRanking(): Ranking {
    const ranking = new Ranking();
    ranking.calculatedScore = parseFloat(
      this.$('[class^="AggregateRatingButton__RatingScore"]').first().text()
    );
    const formattedVotes = this.$(
      '[class^="AggregateRatingButton__TotalRatingAmount"]'
    )
      .first()
      .text();
    if (formattedVotes.endsWith("M")) {
      ranking.votes =
        parseFloat(formattedVotes.replace(/[^0-9.]/g, "")) * 1000000;
    } else if (formattedVotes.endsWith("K")) {
      ranking.votes = parseFloat(formattedVotes.replace(/[^0-9.]/g, "")) * 1000;
    }
    if (!!ranking.votes) {
      ranking.score = ranking.votes * ranking.calculatedScore;
    }
    return ranking;
  }

  getCountries(): string[] {
    const items = [];
    const detailsBlock = this.$("section")
      .find('[data-testid="Details"]')
      .find(".ipc-metadata-list__item");
    detailsBlock.each((i, elem) => {
      const label = this.$(elem).find(".ipc-metadata-list-item__label").text();
      if (label === "Countries of origin") {
        this.$(elem)
          .find(".ipc-metadata-list-item__list-content-item")
          .each((i, elem) => {
            items.push(this.$(elem).text());
          });
      }
    });

    return items;
  }

  getLanguages(): string[] {
    const items = [];
    const detailsBlock = this.$("section")
      .find('[data-testid="Details"]')
      .find(".ipc-metadata-list__item");
    detailsBlock.each((i, elem) => {
      const label = this.$(elem).find(".ipc-metadata-list-item__label").text();
      if (label === "Language") {
        this.$(elem)
          .find(".ipc-metadata-list-item__list-content-item")
          .each((i, elem) => {
            items.push(this.$(elem).text());
          });
      }
    });

    return items;
  }

  getGenres(): string[] {
    const items = [];
    const detailsBlock = this.$("section")
      .find('[data-testid="Storyline"]')
      .find(".ipc-metadata-list__item");
    detailsBlock.each((i, elem) => {
      const label = this.$(elem).find(".ipc-metadata-list-item__label").text();
      if (label === "Genres") {
        this.$(elem)
          .find(".ipc-metadata-list-item__list-content-item")
          .each((i, elem) => {
            items.push(this.$(elem).text());
          });
      }
    });

    return items;
  }

  getOriginalTitle(): string {
    const originalTitle = this.$('[class^="TitleBlock__Container"]').find(
      '[class^="OriginalTitle__OriginalTitleText"]'
    );
    return originalTitle?.text()?.replace("Original title: ", "");
  }

  getYear(): number {
    return parseInt(
      this.$('[class^="TitleBlock__Container"]')
        .find('[class^="TitleBlockMetaData__ListItemText"]')
        .first()
        .text()
    );
  }

  getDuration(): number {
    const formatedDuration = this.$('[class^="TitleBlock__Container"]')
      .find(".ipc-inline-list__item")
      .last()
      ?.text();
    const durationParts = formatedDuration?.split(" ");
    let duration = 0;
    durationParts.forEach((elem) => {
      if (elem.endsWith("h")) {
        duration += parseInt(elem.replace(/[^0-9]/g, "")) * 60;
      } else if (elem.endsWith("min")) {
        duration += parseInt(elem.replace(/[^0-9]/g, ""));
      }
    });

    return duration;
  }

  getColors(): string[] {
    const items = [];
    const colors = this.$('[href^="/search/title/?colors"]');
    if (!!colors.length) {
      colors.each((i, elem) => {
        items.push(this.$(elem).text());
      });
    }

    return items;
  }

  getSounds(): string[] {
    const items = [];
    const sounds = this.$('[href^="/search/title/?sound_mixes"]');
    if (!!sounds.length) {
      sounds.each((i, elem) => {
        items.push(this.$(elem).text());
      });
    }

    return items;
  }

  getBudget(): number | null {
    const boxOfficeItems = this.$('[class*="BoxOffice__MetaDataListItemBoxOffice"]');
    boxOfficeItems.each((i, elem) => {
      const label = this.$(elem).find(".ipc-metadata-list-item__label").text();
      if (label === "Budget") {
        return parseInt(
          this.$(elem)
            .find(".ipc-metadata-list-item__list-content-item")
            .text()
            ?.replace(/[^0-9]/g, "")
        );
      }
    });

    return null;
  }
}
