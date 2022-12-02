import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export abstract class AbstractProvider {
  options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'
    }
  }

  constructor(protected httpService: HttpService) {}

  abstract get(url: URL): Promise<string>;

  protected async getContent(url: URL): Promise<string> {
    return lastValueFrom(
      this.httpService
        .get(url.toString(), this.options)
        .pipe(map((response) => response.data))
    );
  }

  protected cleanContent(html: string): string {
    return html
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "");
  }
}
