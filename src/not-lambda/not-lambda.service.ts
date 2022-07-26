import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { launch } from 'puppeteer';//TODO esto funciona es en local
import {join} from 'path'

@Injectable()
export class NotLambdaService {
  private async getPdfFromPuppeter(user:{name:string}): Promise<Buffer> {
    const browser = await launch({
      headless: true,
      userDataDir: '/dev/null',
    });

    const dirTemplate = join(`${__dirname}`,'..','template','diploma.html')
    const html = readFileSync(dirTemplate, 'utf-8');
    const parseTemplate = html.replace('XXXX',user.name)

    const page = await browser.newPage();
    await page.setContent(parseTemplate, {
      waitUntil: 'networkidle2',
    });
    const buffer = await page.pdf({
      format: 'A4',
      landscape:false
    });
    return buffer;
  }

  /**
   * Funcion crear PDF sin lambda
   * @param user
   */
  public async buildPdf(user: { name: string}): Promise<string> {
    const buffer = await this.getPdfFromPuppeter(user);
    return buffer.toString('base64')
  }
}
