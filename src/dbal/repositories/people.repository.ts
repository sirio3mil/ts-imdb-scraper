import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { Constants } from "src/config/constants";
import { Credit } from "src/imdb/models/credit.model";
import { PeopleAliasTape } from "../models/people-alias-tape.model";
import { PeopleAlias } from "../models/people-alias.model";
import { People } from "../models/people.model";
import { TapePeopleRoleCharacter } from "../models/tape-people-role-character.model";
import { TapePeopleRole } from "../models/tape-people-role.model";
import { DbalTape } from "../models/tape.model";
import { ObjectRepository } from "./object.repository";

@Injectable()
export class PeopleRepository extends ObjectRepository {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
  }

  async getPeople(peopleId: number): Promise<People> {
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

  async insertTapePeopleRole(tapePeopleRole: TapePeopleRole): Promise<TapePeopleRole> {
    const result = await this.connection
      .request()
      .input("peopleId", sql.BigInt, tapePeopleRole.peopleId)
      .input("roleId", sql.TinyInt, tapePeopleRole.roleId)
      .input("tapeId", sql.BigInt, tapePeopleRole.tapeId)
      .query(
        `INSERT INTO [TapePeopleRole] (peopleId, roleId, tapeId) OUTPUT inserted.tapePeopleRoleId VALUES (@peopleId, @roleId, @tapeId)`
      );
    tapePeopleRole.tapePeopleRoleId = parseInt(result.recordset[0].tapePeopleRoleId);

    return tapePeopleRole;
  }

  async insertTapePeopleRoleCharacter(tapePeopleRoleCharacter: TapePeopleRoleCharacter): Promise<TapePeopleRoleCharacter> {
    const result = await this.connection
      .request()
      .input("tapePeopleRoleId", sql.BigInt, tapePeopleRoleCharacter.tapePeopleRoleId)
      .input("character", sql.NVarChar(300), tapePeopleRoleCharacter.character)
      .query(
        `INSERT INTO [TapePeopleRoleCharacter] (tapePeopleRoleId, character) VALUES (@tapePeopleRoleId, @character)`
      );
    if (result.rowsAffected[0] === 0) {
      throw new Error(`Duplicate character ${tapePeopleRoleCharacter.character} found`);
    }
    
    return tapePeopleRoleCharacter;
  }

  async upsertTapePeopleRoleCharacter(tapePeopleRoleCharacter: TapePeopleRoleCharacter): Promise<TapePeopleRoleCharacter> {
    const result = await this.connection
      .request()
      .input("tapePeopleRoleId", sql.BigInt, tapePeopleRoleCharacter.tapePeopleRoleId)
      .input("character", sql.NVarChar(300), tapePeopleRoleCharacter.character)
      .query(
        `MERGE [TapePeopleRoleCharacter] AS target
        USING (SELECT @tapePeopleRoleId AS tapePeopleRoleId, @character AS character) AS source
        ON target.tapePeopleRoleId = source.tapePeopleRoleId 
        WHEN MATCHED THEN UPDATE SET target.character = source.character
        WHEN NOT MATCHED THEN INSERT (tapePeopleRoleId, character) VALUES (source.tapePeopleRoleId, source.character);`
      );
    if (result.rowsAffected[0] === 0) {
      throw new Error(`Error upserting character ${tapePeopleRoleCharacter.character}`);
    }

    return tapePeopleRoleCharacter;
  }

  async getTapePeopleRoles(people: People, tape: DbalTape): Promise<TapePeopleRole[]> {
    const result = await this.connection
      .request()
      .input("peopleId", sql.BigInt, people.peopleId)
      .input("tapeId", sql.BigInt, tape.tapeId)
      .query(
        `SELECT tpr.roleId, tpr.peopleId, tpr.tapeId, tpr.tapePeopleRoleId FROM [TapePeopleRole] tpr INNER JOIN [Role] r ON tpr.roleId = r.roleId WHERE tpr.peopleId = @peopleId AND tpr.tapeId = @tapeId`
      );
    result.recordset.map(tapePeopleRole => {
      tapePeopleRole.roleId = parseInt(tapePeopleRole.roleId);
      tapePeopleRole.tapePeopleRoleId = parseInt(tapePeopleRole.tapePeopleRoleId);
      tapePeopleRole.peopleId = parseInt(tapePeopleRole.peopleId);
      tapePeopleRole.tapeId = parseInt(tapePeopleRole.tapeId);
    });
    return result.recordset;
  }

  async getPeopleAlias(people: People): Promise<PeopleAlias[]> {
    const result = await this.connection
      .request()
      .input("peopleId", sql.BigInt, people.peopleId)
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

  async upsertPeopleAliasTape(peopleAliasTape: PeopleAliasTape): Promise<PeopleAliasTape> {
    const result = await this.connection
      .request()
      .input("peopleAliasId", sql.BigInt, peopleAliasTape.peopleAliasId)
      .input("tapeId", sql.BigInt, peopleAliasTape.tapeId)
      .query(
        `MERGE [PeopleAliasTape] AS target
        USING (SELECT @peopleAliasId AS peopleAliasId, @tapeId AS tapeId) AS source
        ON target.peopleAliasId = source.peopleAliasId AND target.tapeId = source.tapeId
        WHEN NOT MATCHED THEN INSERT (peopleAliasId, tapeId) VALUES (source.peopleAliasId, source.tapeId);`
      );
    if (result.rowsAffected[0] === 0) {
      throw new Error(`Error upserting people alias tape ${peopleAliasTape.peopleAliasId}`);
    }

    return peopleAliasTape;
  }

  async proccessCredits(credits: Credit[], tape: DbalTape): Promise<TapePeopleRole[]> {
    const tapePeopleRoles: TapePeopleRole[] = [];
    const peopleProccessed: People[] = [];
    credits.forEach(async (credit) => {
      const roleId = Constants.roles[credit.role];
      if (!!roleId) {
        // identify peopleId if exits and update, if not, create new object and people rows
        let people = peopleProccessed[credit.person.ID]
        if (!people) {
          people = await this.getPeopleByImdbNumber(credit.person.ID);
          if (!people) {
            const objectId = await this.insertObject(Constants.rowTypes.person);
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
            const tapeRoles = await this.getTapePeopleRoles(people, tape);
            tapePeopleRoles.push(...tapeRoles);
            people.aliases = await this.getPeopleAlias(people);
          }
          peopleProccessed[credit.person.ID] = people;
        }
        if (!!credit.person.alias) {
          let peopleAlias = people.aliases.find(a => a.alias === credit.person.alias);
          if (!peopleAlias) {
            peopleAlias = await this.insertPeopleAlias({
              peopleId: people.peopleId,
              alias: credit.person.alias,
            });
          }
          await this.upsertPeopleAliasTape({
            peopleAliasId: peopleAlias.peopleAliasId,
            tapeId: tape.tapeId,
          });
        }
        let tapePeopleRole = tapePeopleRoles.find((tapePeopleRole) => tapePeopleRole.roleId === roleId && tapePeopleRole.peopleId === people.peopleId);
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
    });

    return tapePeopleRoles;
  }
}
