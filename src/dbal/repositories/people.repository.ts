import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { Constants } from "src/config/constants";
import { ScrappedCredit } from "src/imdb/models/scrapped/credit.model";
import { PeopleAliasTape } from "../models/people-alias-tape.model";
import { PeopleAlias } from "../models/people-alias.model";
import { People } from "../models/people.model";
import { TapePeopleRoleCharacter } from "../models/tape-people-role-character.model";
import { TapePeopleRole } from "../models/tape-people-role.model";
import { Tape } from "../models/tape.model";
import { ObjectRepository } from "./object.repository";

@Injectable()
export class PeopleRepository extends ObjectRepository {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
  }

  async getPeople(peopleId: number): Promise<People> {
    console.log(`getPeople(${peopleId})`);
    const result = await this.connection
      .request()
      .input("peopleId", sql.Int, peopleId)
      .query(
        `SELECT peopleId, objectId, fullName FROM people WHERE peopleId = @peopleId`
      );
    if (result.recordset.length === 0) {
      return null;
    }
    result.recordset[0].peopleId = peopleId;
    return result.recordset[0];
  }

  async insertPeople(people: People): Promise<People> {
    const result = await this.connection
      .request()
      .input("objectId", sql.UniqueIdentifier, people.objectId)
      .input("fullName", sql.NVarChar(100), people.fullName)
      .query(
        `INSERT INTO people (objectId, fullName) OUTPUT inserted.peopleId VALUES (@objectId, @fullName)`
      );
    people.peopleId = parseInt(result.recordset[0].peopleId);

    return people;
  }

  async updatePeople(people: People): Promise<People> {
    const result = await this.connection
      .request()
      .input("peopleId", sql.BigInt, people.peopleId)
      .input("fullName", sql.NVarChar(100), people.fullName)
      .query(
        `UPDATE people SET fullName = @fullName WHERE peopleId = @peopleId`
      );
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
        `SELECT p.peopleId, p.objectId, p.fullName FROM people p INNER JOIN ImdbNumber i ON p.objectId = i.objectId WHERE i.imdbNumber = @imdbNumber`
      );
    if (result.recordset.length === 0) {
      return null;
    }
    result.recordset[0].peopleId = parseInt(result.recordset[0].peopleId);

    return result.recordset[0];
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
    tapePeopleRole.tapePeopleRoleId = parseInt(
      result.recordset[0].tapePeopleRoleId
    );

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

  async getTapePeopleRoles(
    peopleId: number,
    tapeId: number
  ): Promise<TapePeopleRole[]> {
    const result = await this.connection
      .request()
      .input("peopleId", sql.BigInt, peopleId)
      .input("tapeId", sql.BigInt, tapeId)
      .query(
        `SELECT tpr.roleId, tpr.peopleId, tpr.tapeId, tpr.tapePeopleRoleId FROM [TapePeopleRole] tpr WHERE tpr.peopleId = @peopleId AND tpr.tapeId = @tapeId`
      );
    result.recordset.map((tapePeopleRole) => {
      tapePeopleRole.roleId = parseInt(tapePeopleRole.roleId);
      tapePeopleRole.tapePeopleRoleId = parseInt(
        tapePeopleRole.tapePeopleRoleId
      );
      tapePeopleRole.peopleId = parseInt(tapePeopleRole.peopleId);
      tapePeopleRole.tapeId = parseInt(tapePeopleRole.tapeId);
    });
    return result.recordset;
  }

  async getPeopleAlias(peopleId: number): Promise<PeopleAlias[]> {
    const result = await this.connection
      .request()
      .input("peopleId", sql.BigInt, peopleId)
      .query(
        `SELECT pa.peopleAliasId, pa.peopleId, pa.alias FROM [PeopleAlias] pa WHERE pa.peopleId = @peopleId`
      );
    return result.recordset;
  }

  async insertPeopleAlias(peopleAlias: PeopleAlias): Promise<PeopleAlias> {
    const result = await this.connection
      .request()
      .input("peopleId", sql.BigInt, peopleAlias.peopleId)
      .input("alias", sql.NVarChar(100), peopleAlias.alias)
      .query(
        `INSERT INTO [PeopleAlias] (peopleId, alias) OUTPUT inserted.peopleAliasId VALUES (@peopleId, @alias)`
      );
    peopleAlias.peopleAliasId = parseInt(result.recordset[0].peopleAliasId);

    return peopleAlias;
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

  async getPeopleAliasTapes(peopleAliasId: number): Promise<PeopleAliasTape[]> {
    const result = await this.connection
      .request()
      .input("peopleAliasId", sql.BigInt, peopleAliasId)
      .query(
        `SELECT pat.peopleAliasId, pat.tapeId FROM [PeopleAliasTape] pat WHERE pat.peopleAliasId = @peopleAliasId`
      );
    result.recordset.map((peopleAliasTape) => {
      peopleAliasTape.peopleAliasId = parseInt(peopleAliasTape.peopleAliasId);
      peopleAliasTape.tapeId = parseInt(peopleAliasTape.tapeId);
    });
    return result.recordset;
  }

  async getPeopleAliasTape(
    peopleAliasId: number,
    tapeId: number
  ): Promise<PeopleAliasTape[]> {
    const result = await this.connection
      .request()
      .input("peopleAliasId", sql.BigInt, peopleAliasId)
      .input("tapeId", sql.BigInt, tapeId)
      .query(
        `SELECT pat.peopleAliasId, pat.tapeId FROM [PeopleAliasTape] pat WHERE pat.peopleAliasId = @peopleAliasId AND pat.tapeId = @tapeId`
      );
    result.recordset.map((peopleAliasTape) => {
      peopleAliasTape.peopleAliasId = parseInt(peopleAliasTape.peopleAliasId);
      peopleAliasTape.tapeId = parseInt(peopleAliasTape.tapeId);
    });
    return result.recordset[0];
  }

  async proccessCredits(
    credits: ScrappedCredit[],
    tape: Tape
  ): Promise<TapePeopleRole[]> {
    const tapePeopleRoles: TapePeopleRole[] = [];
    const peopleProccessed: People[] = [];
    await Promise.all(
      credits.map(async (credit) => {
        const roleId = Constants.roles[credit.role];
        if (!!roleId) {
          // identify peopleId if exits and update, if not, create new object and people rows
          let people = peopleProccessed[credit.person.ID];
          if (!people) {
            people = await this.getPeopleByImdbNumber(credit.person.ID);
            if (!people) {
              const objectId = await this.insertObject(
                Constants.rowTypes.person
              );
              [, people] = await Promise.all([
                this.insertImdbNumber(objectId, credit.person.ID),
                this.insertPeople({
                  objectId,
                  fullName: credit.person.fullName,
                }),
              ]);
            } else {
              people.fullName = credit.person.fullName;
              people = await this.updatePeople(people);
              const tapeRoles = await this.getTapePeopleRoles(
                people.peopleId,
                tape.tapeId
              );
              tapePeopleRoles.push(...tapeRoles);
              people.aliases = await this.getPeopleAlias(people.peopleId);
            }
            peopleProccessed[credit.person.ID] = people;
          }
          if (!!credit.person.alias) {
            let peopleAlias = people.aliases.find(
              (a) => a.alias === credit.person.alias
            );
            if (!peopleAlias) {
              peopleAlias = await this.insertPeopleAlias({
                peopleId: people.peopleId,
                alias: credit.person.alias,
              });
              await this.insertPeopleAliasTape({
                peopleAliasId: peopleAlias.peopleAliasId,
                tapeId: tape.tapeId,
              });
            } else {
              const peopleAliasTape = await this.getPeopleAliasTape(
                peopleAlias.peopleAliasId,
                tape.tapeId
              );
              if (!peopleAliasTape) {
                await this.insertPeopleAliasTape({
                  peopleAliasId: peopleAlias.peopleAliasId,
                  tapeId: tape.tapeId,
                });
              }
            }
          }
          let tapePeopleRole = tapePeopleRoles.find(
            (tapePeopleRole) =>
              tapePeopleRole.roleId === roleId &&
              tapePeopleRole.peopleId === people.peopleId
          );
          if (!tapePeopleRole) {
            tapePeopleRole = await this.insertTapePeopleRole({
              peopleId: people.peopleId,
              roleId,
              tapeId: tape.tapeId,
            });
            tapePeopleRoles.push(tapePeopleRole);
          }
          if (!!credit.character) {
            this.upsertTapePeopleRoleCharacter({
              tapePeopleRoleId: tapePeopleRole.tapePeopleRoleId,
              character: credit.character,
            });
          }
        }
      })
    );

    return tapePeopleRoles;
  }
}
