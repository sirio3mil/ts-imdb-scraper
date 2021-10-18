import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { map }  from  "rxjs/operators";

@Injectable()
export abstract class AbstractProvider {
  constructor(protected httpService: HttpService) {}

  abstract get(url: string): Promise<string>;

  protected async getContent(url: string): Promise<string> {
    return lastValueFrom(this.httpService.get(url).pipe(map(response => response.data)));
  }
}
