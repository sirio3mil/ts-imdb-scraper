import { Injectable } from "@nestjs/common";
import { EpisodeListItem } from "../models/scrapped/episode-list-item.model";
import { AbstractProvider } from "../providers/abstract.provider";
import { HtmlService } from "./html.service";

@Injectable()
export class EpisodeListService extends HtmlService {
  protected seasonNumber: number;

  constructor(protected provider: AbstractProvider) {
    super(provider);
    this.page = "episodes";
  }

  setSeasonNumber(seasonNumber: number): this {
    this.seasonNumber = seasonNumber;
    this.page = `episodes?season=${seasonNumber}`;
    return this;
  }

  getEpisodeListItems(): EpisodeListItem[] {
    const items: EpisodeListItem[] = [];
    const blocks = this.$('.eplist').find('.info');
    blocks.each((i, block) => {
      const _block = this.$(block);
      let airDate: Date;
      const date = _block.find('.airdate').text()?.trim();
      let fullAirDate = false;
      if (date) {
        const localDate = new Date(date);
        airDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0));
        fullAirDate = date.match(/(\D)/gmi)?.length ? true : false;
      }
      const _episode = _block.find('strong').find('a');
      const title = _episode.text();
      const imdbNumber = parseInt(_episode.attr('href')?.match(/tt([\d]+)/)[1]);
      items.push({
        title,
        imdbNumber,
        airDate,
        fullAirDate,
      });
    });

    return items;
  }
}
