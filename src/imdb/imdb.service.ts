import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Tape } from "./models/tape.model";

@Injectable()
export class ImdbService {
  constructor(private httpService: HttpService) {}
  
  async getTape(imdbNumber: number): Promise<Tape> {
    return {} as any;
  }
  async importTape(imdbNumber: number): Promise<Tape> {
    return {} as any;
  }
}
