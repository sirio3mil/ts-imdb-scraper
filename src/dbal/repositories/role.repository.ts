import { Inject, Injectable } from "@nestjs/common";
import * as sql from "mssql";
import { Role } from "../models/role.model";
import { ObjectRepository } from "./object.repository";

@Injectable()
export class RoleRepository extends ObjectRepository {
  constructor(@Inject("CONNECTION") connection: sql.ConnectionPool) {
    super(connection);
  }

  async getRole(roleId: number): Promise<Role> {
    const result = await this.connection
      .request()
      .input("roleId", sql.Int, roleId)
      .query(`SELECT roleId, role FROM [role] WHERE roleId = @roleId`);
    if (result.recordset.length === 0) {
      return null;
    }
    result.recordset[0].roleId = roleId;
    return result.recordset[0];
  }
}
