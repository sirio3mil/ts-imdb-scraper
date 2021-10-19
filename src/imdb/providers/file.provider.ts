import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AbstractProvider } from "./abstract.provider";
import { writeFile, existsSync, readFileSync } from "fs";
import { join, resolve} from "path";
import { createHash } from "crypto";
import { URL } from 'url';

@Injectable()
export class FileProvider extends AbstractProvider {
  constructor(protected httpService: HttpService) {
    super(httpService)
  }

  async get(url: URL): Promise<string> {
    const hash = createHash('md5').update(url.toString()).digest("hex");
    const localPath = join(resolve('./'), 'files', `${hash}.html`);
    if (existsSync(localPath)) {
      return readFileSync(localPath, 'utf8');
    }
    const urlContent = await this.getContent(url);
    writeFile(localPath, urlContent, () => { /* Silent error */ });
    return urlContent;
  }
}
