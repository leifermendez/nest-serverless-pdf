import chromium from 'chrome-aws-lambda';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';

/**
 * Esto es el servicio para produccion
 */
@Injectable()
export class LambdaService {
  private async getPdfFromPuppeter(user: { name: string }): Promise<Buffer> {
    const puppeteer = chromium.puppeteer;

    const browser = await puppeteer.launch({
      headless: true,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
    });

    const dirTemplate = join(`${__dirname}`, '..', 'template', 'diploma.html');
    const html = readFileSync(dirTemplate, 'utf-8');
    const parseTemplate = html.replace('XXXX', user.name);

    const page = await browser.newPage();
    await page.setContent(parseTemplate, {
      waitUntil: 'load',
    });
    const buffer = await page.pdf({
      format: 'A4',
      landscape: false,
    });
    return buffer;
  }

  /**
   * Funcion crear PDF sin lambda
   * @param user
   */
  public async buildPdf(user: { name: string }): Promise<string> {
    const buffer = await this.getPdfFromPuppeter(user);
    return buffer.toString('base64');
  }
}
