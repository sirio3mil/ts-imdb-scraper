import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { map } from "rxjs/operators";
import { URL } from "url";

@Injectable()
export abstract class AbstractProvider {
  constructor(protected httpService: HttpService) {}

  abstract get(url: URL): Promise<string>;

  protected async getContent(url: URL): Promise<string> {
    return lastValueFrom(
      this.httpService
        .get(url.toString())
        .pipe(map((response) => response.data))
    );
  }
}
