import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { Tag } from "src/dbal/models/tag.model";

@Injectable()
export class TagRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async getTapeTags(tapeId: number): Promise<Tag[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT t.tagId, t.keyword FROM [Tag] t INNER JOIN [TapeTag] tt ON tt.tagId = t.tagId WHERE tt.tapeId = @tapeId`;

    return result.recordset;
  }

  async insertMissingTags(keywords: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    const notFound: string[] = [];
    let stmt = new sql.PreparedStatement(this.connection);
    stmt.input("keyword", sql.NVarChar(150));
    await stmt.prepare(
      `SELECT tagId, keyword FROM Tag WHERE keyword = @keyword`
    );
    for (const keyword of keywords) {
      const result = await stmt.execute({ keyword });
      if (result.recordset.length > 0) {
        tags.push(<Tag>result.recordset[0]);
      } else {
        notFound.push(keyword);
      }
    }
    await stmt.unprepare();
    if (notFound.length > 0) {
      stmt = new sql.PreparedStatement(this.connection);
      stmt.input("keyword", sql.NVarChar(150));
      await stmt.prepare(
        `INSERT INTO Tag (keyword) OUTPUT inserted.tagId VALUES (@keyword)`
      );
      for (const keyword of notFound) {
        const result = await stmt.execute({ keyword });
        if (result.recordset.length > 0) {
          tags.push({
            tagId: result.recordset[0].tagId,
            keyword,
          });
        }
      }
      await stmt.unprepare();
    }

    return tags;
  }

  async processKeywords(tapeId: number, keywords: string[]): Promise<number> {
    let tags = await this.getTapeTags(tapeId);
    const notFound = keywords.filter((keyword) => {
      return tags.findIndex((l) => l.keyword === keyword) === -1;
    });
    tags = await this.insertMissingTags(notFound);
    const stmt = new sql.PreparedStatement(this.connection);
    stmt.input("tapeId", sql.BigInt);
    stmt.input("tagId", sql.BigInt);
    await stmt.prepare(
      `INSERT INTO TapeTag (tapeId, tagId) VALUES (@tapeId, @tagId)`
    );
    for (const tag of tags) {
      await stmt.execute({ tapeId, tagId: tag.tagId });
    }
    await stmt.unprepare();
    return tags.length;
  }
}
