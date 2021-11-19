import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
import { Constants } from "src/config/constants";
import { CountryRepository } from "src/dbal/repositories/country.repository";
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
            tvShow: this.tapeService.isTvShow(),
            tvShowChapter: this.tapeService.isTvShowChapter(),
            tapeId: storedTape.tapeId,
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
            tvShow: this.tapeService.isTvShow(),
            tvShowChapter: this.tapeService.isTvShowChapter(),
            tapeId: storedTape.tapeId,
          }),
        ]);
      }
      const countries =
        await this.countryRepository.processCountriesOfficialNames(
          this.tapeService.getCountries()
        );
      const countriesAdded = await this.tapeRepository.addCountries(
        storedTape.tapeId,
        countries
      );
      const sounds =
        await this.soundRepository.processSoundDescriptions(
          this.tapeService.getSounds()
        );
      const soundsAdded = await this.tapeRepository.addSounds(
        storedTape.tapeId,
        sounds
      );
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
      };
    } catch (err) {
      throw err;
    }
  }
}
