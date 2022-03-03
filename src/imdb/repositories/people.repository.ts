import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import slug from 'limax';
import { Constants } from "src/config/constants";
import { ScrappedCredit } from "src/imdb/models/scrapped/credit.model";
import { PeopleAliasTape } from "src/dbal/models/people-alias-tape.model";
import { PeopleAlias } from "src/dbal/models/people-alias.model";
import { People } from "src/dbal/models/people.model";
import { TapePeopleRoleCharacter } from "src/dbal/models/tape-people-role-character.model";
import { TapePeopleRole } from "src/dbal/models/tape-people-role.model";
import { ObjectRepository } from "./object.repository";
import { TitleRepository } from "./title.repository";

@Injectable()
export class PeopleRepository extends ObjectRepository {
  private titleRepository: TitleRepository;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool, titleRepository: TitleRepository) {
    super(connection);
    this.titleRepository = titleRepository;
  }

  async insertPeople(people: People): Promise<People> {
    const [result, ] = await Promise.all([
      this.connection
        .request()
        .input("objectId", sql.UniqueIdentifier, people.objectId)
        .input("fullName", sql.NVarChar(100), people.fullName)
        .query`INSERT INTO people (objectId, fullName) OUTPUT inserted.peopleId VALUES (@objectId, @fullName)`,
      this.titleRepository.insertSearchValue({
        objectId: people.objectId,
        searchParam: people.fullName,
        primaryParam: true,
        slug: slug(people.fullName)
      })
    ]);
    people.peopleId = result.recordset[0].peopleId;

    return people;
  }

  async updatePeople(people: People): Promise<People> {
    const [result, ] = await Promise.all([
      this.connection
        .request()
        .input("peopleId", sql.BigInt, people.peopleId)
        .input("fullName", sql.NVarChar(100), people.fullName)
        .query`UPDATE people SET fullName = @fullName WHERE peopleId = @peopleId`,
      this.titleRepository.insertSearchValue({
        objectId: people.objectId,
        searchParam: people.fullName,
        primaryParam: true,
        slug: slug(people.fullName)
      })
    ]);
    if (result.rowsAffected[0] === 0) {
      throw new Error("People not found");
    }

    return people;
  }

  async getPeopleByImdbNumber(imdbNumber: number): Promise<People | null> {
    const result = await this.connection
      .request()
      .input("imdbNumber", sql.BigInt, imdbNumber)
      .query(
        `SELECT p.peopleId
          ,p.objectId
          ,p.fullName 
          ,pa.alias
          ,pa.peopleAliasId
        FROM people p 
        INNER JOIN ImdbNumber i ON p.objectId = i.objectId 
        LEFT JOIN PeopleAlias pa ON pa.peopleId = p.peopleId
        WHERE i.imdbNumber = @imdbNumber`
      );
    if (result.recordset.length === 0) {
      return null;
    }

    return {
      peopleId: result.recordset[0].peopleId,
      objectId: result.recordset[0].objectId,
      fullName: result.recordset[0].fullName,
      aliases: result.recordset.filter(r => !!r.peopleAliasId).map(r => {
        return <PeopleAlias>{
          peopleAliasId: r.peopleAliasId,
          alias: r.alias
        };
      }),
    };
  }

  async insertTapePeopleRole(
    tapePeopleRole: TapePeopleRole
  ): Promise<TapePeopleRole> {
    const result = await this.connection
      .request()
      .input("peopleId", sql.BigInt, tapePeopleRole.peopleId)
      .input("roleId", sql.TinyInt, tapePeopleRole.roleId)
      .input("tapeId", sql.BigInt, tapePeopleRole.tapeId)
      .query(
        `INSERT INTO [TapePeopleRole] (peopleId, roleId, tapeId) OUTPUT inserted.tapePeopleRoleId VALUES (@peopleId, @roleId, @tapeId)`
      );
    tapePeopleRole.tapePeopleRoleId = result.recordset[0].tapePeopleRoleId;

    return tapePeopleRole;
  }

  async insertTapePeopleRoleCharacter(
    tapePeopleRoleCharacter: TapePeopleRoleCharacter
  ): Promise<TapePeopleRoleCharacter> {
    const result = await this.connection
      .request()
      .input(
        "tapePeopleRoleId",
        sql.BigInt,
        tapePeopleRoleCharacter.tapePeopleRoleId
      )
      .input("character", sql.NVarChar(300), tapePeopleRoleCharacter.character)
      .query(
        `INSERT INTO [TapePeopleRoleCharacter] (tapePeopleRoleId, character) VALUES (@tapePeopleRoleId, @character)`
      );
    if (result.rowsAffected[0] === 0) {
      throw new Error(
        `Duplicate character ${tapePeopleRoleCharacter.character} found`
      );
    }

    return tapePeopleRoleCharacter;
  }

  async upsertTapePeopleRoleCharacter(
    tapePeopleRoleCharacter: TapePeopleRoleCharacter
  ): Promise<TapePeopleRoleCharacter> {
    const result = await this.connection
      .request()
      .input(
        "tapePeopleRoleId",
        sql.BigInt,
        tapePeopleRoleCharacter.tapePeopleRoleId
      )
      .input("character", sql.NVarChar(300), tapePeopleRoleCharacter.character)
      .query(
        `UPDATE [TapePeopleRoleCharacter] SET character = @character WHERE tapePeopleRoleId = @tapePeopleRoleId`
      );
    if (result.rowsAffected[0] === 0) {
      return this.insertTapePeopleRoleCharacter(tapePeopleRoleCharacter);
    }

    return tapePeopleRoleCharacter;
  }

  async getTapePeopleRoles(tapeId: number): Promise<TapePeopleRole[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT tpr.roleId, tpr.peopleId, tpr.tapeId, tpr.tapePeopleRoleId FROM [TapePeopleRole] tpr WHERE tpr.tapeId = @tapeId`;

    return result.recordset;
  }

  async insertPeopleAlias(alias: string, people: People): Promise<PeopleAlias> {
    const [result, ] = await Promise.all([
      this.connection
        .request()
        .input("peopleId", sql.BigInt, people.peopleId)
        .input("alias", sql.NVarChar(100), alias)
        .query`INSERT INTO [PeopleAlias] (peopleId, alias) OUTPUT inserted.peopleAliasId VALUES (@peopleId, @alias)`,
      this.titleRepository.insertSearchValue({
        objectId: people.objectId,
        searchParam: alias,
        primaryParam: false,
        slug: slug(alias)
      })
    ]);

    return {
      peopleAliasId: result.recordset[0].peopleAliasId,
      peopleId: people.peopleId,
      alias
    };
  }

  async insertPeopleAliasTape(
    peopleAliasTape: PeopleAliasTape
  ): Promise<PeopleAliasTape> {
    const result = await this.connection
      .request()
      .input("peopleAliasId", sql.BigInt, peopleAliasTape.peopleAliasId)
      .input("tapeId", sql.BigInt, peopleAliasTape.tapeId)
      .query(
        `INSERT INTO [PeopleAliasTape] (peopleAliasId, tapeId) VALUES (@peopleAliasId, @tapeId)`
      );
    if (result.rowsAffected[0] === 0) {
      throw new Error("PeopleAliasTape not inserted");
    }

    return peopleAliasTape;
  }

  async getTapePeopleAlias(tapeId: number): Promise<PeopleAliasTape[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT pat.peopleAliasId, pat.tapeId FROM [PeopleAliasTape] pat WHERE pat.tapeId = @tapeId`;

    return result.recordset;
  }

  async proccessCredits(
    tapeId: number,
    credits: ScrappedCredit[]
  ): Promise<TapePeopleRole[]> {
    const peopleProccessed: People[] = [];
    const [tapePeopleRoles, tapePeopleAlias] = await Promise.all([
      this.getTapePeopleRoles(tapeId),
      this.getTapePeopleAlias(tapeId)
    ]);

    await Promise.all(
      credits.map(async (credit) => {
        const roleId = Constants.roles[credit.role];
        // identify peopleId if exits and update, if not, create new object and people rows
        let people = peopleProccessed[credit.person.ID];
        if (!people) {
          people = await this.getPeopleByImdbNumber(credit.person.ID);
          if (!people) {
            let objectId = await this.getObjectId(Constants.rowTypes.tape, credit.person.ID)
            if (!objectId) {
              objectId = await this.insertObject(
                Constants.rowTypes.person
              );
              this.insertImdbNumber(objectId, credit.person.ID);
            }
            people = await this.insertPeople({
              objectId,
              fullName: credit.person.fullName,
            });
          } else if (people.fullName !== credit.person.fullName) {
            people.fullName = credit.person.fullName;
            people = await this.updatePeople(people);
          }
          peopleProccessed[credit.person.ID] = people;
        }
        if (!!credit.person.alias) {
          let peopleAlias = people.aliases.find(
            (a) => a.alias === credit.person.alias
          );
          if (!peopleAlias) {
            peopleAlias = await this.insertPeopleAlias(credit.person.alias, people);
            await this.insertPeopleAliasTape({
              peopleAliasId: peopleAlias.peopleAliasId,
              tapeId,
            });
            people.aliases.push(peopleAlias);
          } else if (!tapePeopleAlias.find((a) => a.peopleAliasId === peopleAlias.peopleAliasId)) {
            await this.insertPeopleAliasTape({
              peopleAliasId: peopleAlias.peopleAliasId,
              tapeId,
            });
          }
        }
        let tapePeopleRole = tapePeopleRoles.find((e) => e.roleId === roleId && e.peopleId === people.peopleId);
        if (!tapePeopleRole) {
          tapePeopleRole = await this.insertTapePeopleRole({
            peopleId: people.peopleId,
            roleId,
            tapeId,
          });
          tapePeopleRoles.push(tapePeopleRole);
        }
        if (!!credit.character) {
          this.upsertTapePeopleRoleCharacter({
            tapePeopleRoleId: tapePeopleRole.tapePeopleRoleId,
            character: credit.character,
          });
        }
      })
    );

    return tapePeopleRoles;
  }
}
