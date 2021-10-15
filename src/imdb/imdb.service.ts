import { Injectable } from '@nestjs/common';
import { Tape } from './models/tape.model';

@Injectable()
export class ImdbService {
  async import(imdbNumber: number): Promise<Tape> {
    return {} as any;
  }
}
