import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { Location } from "src/dbal/models/location.model";

@Injectable()
export class LocationRepository {
  private connection: sql.ConnectionPool;

  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    this.connection = connection;
  }

  async getTapeLocations(tapeId: number): Promise<Location[]> {
    const result = await this.connection
      .request()
      .input("tapeId", sql.BigInt, tapeId)
      .query`SELECT l.locationId, l.place FROM [Location] l INNER JOIN [TapeLocation] tl ON tl.locationId = l.locationId WHERE tl.tapeId = @tapeId`;

    return result.recordset;
  }

  async insertMissingPlaces(places: string[]): Promise<Location[]> {
    const locations: Location[] = [];
    const notFound: string[] = [];
    let stmt = new sql.PreparedStatement(this.connection);
    stmt.input("place", sql.NVarChar(100));
    await stmt.prepare(
      `SELECT locationId, place FROM location WHERE place = @place`
    );
    for (const place of places) {
      const result = await stmt.execute({ place });
      if (result.recordset.length > 0) {
        locations.push(<Location>result.recordset[0]);
      } else {
        notFound.push(place);
      }
    }
    await stmt.unprepare();
    if (notFound.length > 0) {
      stmt = new sql.PreparedStatement(this.connection);
      stmt.input("place", sql.NVarChar(50));
      await stmt.prepare(
        `INSERT INTO location (place) OUTPUT inserted.locationId VALUES (@place)`
      );
      for (const place of notFound) {
        const result = await stmt.execute({ place });
        if (result.recordset.length > 0) {
          locations.push({
            locationId: result.recordset[0].locationId,
            place,
          });
        }
      }
      await stmt.unprepare();
    }

    return locations;
  }

  async processLocations(tapeId: number, places: string[]): Promise<number> {
    let locations = await this.getTapeLocations(tapeId);
    const notFound = places.filter((place) => {
      return locations.findIndex((l) => l.place === place) === -1;
    });
    locations = await this.insertMissingPlaces(notFound);
    const stmt = new sql.PreparedStatement(this.connection);
    stmt.input("tapeId", sql.BigInt);
    stmt.input("locationId", sql.BigInt);
    await stmt.prepare(
      `INSERT INTO TapeLocation (tapeId, locationId) VALUES (@tapeId, @locationId)`
    );
    for (const location of locations) {
      await stmt.execute({ tapeId, locationId: location.locationId });
    }
    await stmt.unprepare();
    return locations.length;
  }
}
