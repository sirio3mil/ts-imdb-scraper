import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { Sound } from "../models/sound.model";

@Injectable()
export class SoundRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async processSoundDescriptions(descriptions: string[]): Promise<Sound[]> {
    const sounds: Sound[] = [];
    const notFoundSounds: string[] = [];
    let stmt = new sql.PreparedStatement(this.connection);
    stmt.input("description", sql.NVarChar(50));
    await stmt.prepare(
      `SELECT soundId, description FROM sound WHERE description = @description`
    );
    for (const description of descriptions) {
      const result = await stmt.execute({ description });
      if (result.recordset.length > 0) {
        sounds.push(<Sound>result.recordset[0]);
      } else {
        notFoundSounds.push(description);
      }
    }
    await stmt.unprepare();
    if (notFoundSounds.length > 0) {
      stmt = new sql.PreparedStatement(this.connection);
      stmt.input("description", sql.NVarChar(50));
      await stmt.prepare(
        `INSERT INTO sound (description) OUTPUT inserted.soundId VALUES (@description)`
      );
      for (const description of notFoundSounds) {
        const result = await stmt.execute({ description });
        if (result.recordset.length > 0) {
          sounds.push({
            soundId: parseInt(result.recordset[0].soundId),
            description,
          });
        }
      }
      await stmt.unprepare();
    }

    return sounds;
  }
}
