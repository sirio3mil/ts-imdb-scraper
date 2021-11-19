import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
import { Constants } from "src/config/constants";
import { CountryRepository } from "src/dbal/repositories/country.repository";
import { GenreRepository } from "src/dbal/repositories/genre.repository";
import { LanguageRepository } from "src/dbal/repositories/language.repository";
import { RankingRepository } from "src/dbal/repositories/ranking.repository";
import { SoundRepository } from "src/dbal/repositories/sound.repository";
import { TapeRepository } from "src/dbal/repositories/tape.repository";
import { TapeResult } from "../models/tape-result.model";
import { TapeService } from "../services/tape.service";

@Resolver(() => TapeResult)
export class ImdbResolver {
  constructor(
    private readonly tapeService: TapeService,
    private readonly tapeRepository: TapeRepository,
    private readonly countryRepository: CountryRepository,
    private readonly soundRepository: SoundRepository,
    private readonly languageRepository: LanguageRepository,
    private readonly genreRepository: GenreRepository,
    private readonly rankingRepository: RankingRepository,
  ) {}

  @Mutation(() => TapeResult)
  async importTape(
    @Args("imdbNumber", { type: () => Int }) imdbNumber: number
  ) {
    try {
      const url = this.tapeService.createUrl(imdbNumber);
      const [tapeContent] = await Promise.all([
        this.tapeService.getContent(url),
      ]);
      this.tapeService.set$(tapeContent);
      let storedTape = await this.tapeRepository.getTapeByImdbNumber(
        imdbNumber
      );
      const ranking = this.tapeService.getRanking();
      const isTvShow = this.tapeService.isTvShow();
      if (!storedTape) {
        const objectId = await this.tapeRepository.insertObject(
          Constants.rowTypes.tape
        );
        [, storedTape] = await Promise.all([
          this.tapeRepository.insertImdbNumber(objectId, imdbNumber),
          this.tapeRepository.insertTape({
            objectId,
            originalTitle: this.tapeService.getOriginalTitle(),
          }),
          this.tapeRepository.insertTapeDetail({
            duration: this.tapeService.getDuration(),
            year: this.tapeService.getYear(),
            budget: this.tapeService.getBudget(),
            color: this.tapeService.getColors().join(", "),
            tvShow: isTvShow,
            tvShowChapter: this.tapeService.isTvShowChapter(),
            tapeId: storedTape.tapeId,
          }),
          this.rankingRepository.insertRanking({
            score: ranking.score,
            votes: ranking.votes,
            realScore: ranking.realScore,
            objectId: storedTape.objectId,
          }),
        ]);
      } else {
        [storedTape] = await Promise.all([
          this.tapeRepository.upsertTape({
            objectId: storedTape.objectId,
            originalTitle: this.tapeService.getOriginalTitle(),
            tapeId: storedTape.tapeId,
          }),
          this.tapeRepository.upsertTapeDetail({
            duration: this.tapeService.getDuration(),
            year: this.tapeService.getYear(),
            budget: this.tapeService.getBudget(),
            color: this.tapeService.getColors().join(", "),
            tvShow: isTvShow,
            tvShowChapter: this.tapeService.isTvShowChapter(),
            tapeId: storedTape.tapeId,
          }),
          this.rankingRepository.upsertRanking({
            score: ranking.score,
            votes: ranking.votes,
            realScore: ranking.realScore,
            objectId: storedTape.objectId,
          }),
        ]);
      }
      let finished: boolean;
      if (isTvShow) {
        finished = this.tapeService.isFinished();
        this.tapeRepository.upsertTvShow(storedTape, finished);
      }
      const [countries, sounds, languages, genres] = await Promise.all([
        this.countryRepository.processCountriesOfficialNames(
          this.tapeService.getCountries()
        ),
        this.soundRepository.processSoundDescriptions(
          this.tapeService.getSounds()
        ),
        this.languageRepository.processLanguageNames(
          this.tapeService.getLanguages()
        ),
        this.genreRepository.processGenreNames(
          this.tapeService.getGenres()
        ),
      ]);
      const [countriesAdded, soundsAdded, languagesAdded, genresAdded] = await Promise.all([
        this.tapeRepository.addCountries(storedTape.tapeId, countries),
        this.tapeRepository.addSounds(storedTape.tapeId, sounds),
        this.tapeRepository.addLanguages(storedTape.tapeId, languages),
        this.tapeRepository.addGenres(storedTape.tapeId, genres),
      ]);
      return {
        objectId: storedTape.objectId,
        tapeId: storedTape.tapeId,
        countries: {
          total: countries.length,
          added: countriesAdded,
        },
        sounds: {
          total: sounds.length,
          added: soundsAdded,
        },
        languages: {
          total: languages.length,
          added: languagesAdded,
        },
        genres: {
          total: genres.length,
          added: genresAdded,
        },
        ranking,
        finished,
      };
    } catch (err) {
      throw err;
    }
  }
}
