import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { get, put } from "memory-cache";
import { URL } from "url";
import { AbstractProvider } from "./abstract.provider";

@Injectable()
export class MemoryProvider extends AbstractProvider {
  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  async get(url: URL): Promise<string> {
    const cachedResponse = get(url);
    if (cachedResponse) {
      return cachedResponse;
    }
    const hours = 24;
    const urlContent = await this.getContent(url);
    const cleanContent = this.cleanContent(urlContent);
    put(url, cleanContent, hours * 1000 * 60 * 60);
    return cleanContent;
  }
}
