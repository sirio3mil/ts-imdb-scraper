import { Injectable } from '@nestjs/common';
import { Tape } from './models/tape.model';

@Injectable()
export class ImdbService {
  async get(imdbNumber: number): Promise<Tape> {
    return {} as any;
  }
  async import(imdbNumber: number): Promise<Tape> {
    return {} as any;
  }
}
