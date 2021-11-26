import { Injectable } from "@nestjs/common";
import { ScrappedEpisode } from "../models/episode.model";
import { ScrappedRanking } from "../models/ranking.model";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class TapeService extends HtmlService {
  constructor(protected provider: AbstractProvider) {
    super(provider);
  }

  getRanking(): ScrappedRanking | null {
    const ratingScore = this.$('[class^="AggregateRatingButton__RatingScore"]');
    if (!ratingScore.length) {
      return null;
    }
    const ranking = new ScrappedRanking();
    const ratingAmount = this.$(
      '[class^="AggregateRatingButton__TotalRatingAmount"]'
    );
    ranking.realScore = parseFloat(ratingScore.first().text());
    const formattedVotes = ratingAmount.first().text();
    if (formattedVotes.endsWith("M")) {
      ranking.votes =
        parseFloat(formattedVotes.replace(/[^0-9.]/g, "")) * 1000000;
    } else if (formattedVotes.endsWith("K")) {
      ranking.votes = parseFloat(formattedVotes.replace(/[^0-9.]/g, "")) * 1000;
    }
    if (!!ranking.votes) {
      ranking.score = ranking.votes * ranking.realScore;
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
      if (label.endsWith("of origin")) {
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
      if (label.startsWith("Language")) {
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
      if (label.startsWith("Genre")) {
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
    let title = this.$('[class^="OriginalTitle__OriginalTitleText"]');
    if (title.length) {
      return title.text()?.replace("Original title: ", "");
    }
    title = this.$('[class^="TitleHeader__TitleText"]');
    return title?.text();
  }

  protected getYears(): number[] {
    const items = [];
    const text = this.$('[class^="TitleBlock__Container"]')
      .find('[class^="TitleBlockMetaData__ListItemText"]')
      .first()
      ?.text();
    if (!!text) {
      const year = text.match(/\d{4}/g);
      if (!!year) {
        year.forEach((elem) => {
          items.push(parseInt(elem));
        });
      }
    }

    return items;
  }

  getYear(): number {
    const years = this.getYears();
    if (!years.length) {
      const item = this.$('[class^="TitleBlock__Container"]')
        .find(".ipc-inline-list__item")
        .first()
        ?.text();
      if (!!item && item.startsWith("Episode air")) {
        const year = item.match(/\d{4}/g);
        if (!!year) {
          return parseInt(year[0]);
        }
      }
      return 0;
    }

    return years[0];
  }

  isFinished(): boolean {
    return this.getYears().length === 2;
  }

  isTvShow(): boolean {
    const item = this.$('[class^="TitleBlock__Container"]')
      .find(".ipc-inline-list__item")
      .first()
      ?.text();
    return !!item?.includes("TV Series") || !!item?.includes("TV Mini Series");
  }

  isTvShowChapter(): boolean {
    return this.$('[class^="EpisodeNavigationForEpisode"]').length > 0;
  }

  getEpisode(): ScrappedEpisode | null {
    const items = this.$(
      '[class^="EpisodeNavigationForEpisode__SeasonEpisodeNumbersItem"]'
    );
    if (!items.length) {
      return null;
    }
    const episode = new ScrappedEpisode();
    items.each((i, item) => {
      const text = this.$(item).text();
      if (text.startsWith("S")) {
        const seasonNumber = text.match(/\d{1,3}/g);
        episode.season = parseInt(seasonNumber[0]);
      } else if (text.startsWith("E")) {
        const episodeNumber = text.match(/\d{1,3}/g);
        episode.chapter = parseInt(episodeNumber[0]);
      }
    });
    const parentLink = this.$('[class*="SeriesParentLink__ParentTextLink"]');
    if (!!parentLink.length) {
      episode.tvShowID = parseInt(parentLink.attr("href").match(/\d+/g)[0]);
    }
    return episode;
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
      } else if (elem.endsWith("m")) {
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
    let budget: number | null = null;
    const boxOfficeItems = this.$(
      '[class*="BoxOffice__MetaDataListItemBoxOffice"]'
    );
    boxOfficeItems.each((i, elem) => {
      const label = this.$(elem).find(".ipc-metadata-list-item__label").text();
      if (label === "Budget") {
        budget = parseInt(
          this.$(elem)
            .find(".ipc-metadata-list-item__list-content-item")
            .text()
            ?.replace(/[^0-9]/g, "")
        );
      }
    });

    return budget;
  }
}
