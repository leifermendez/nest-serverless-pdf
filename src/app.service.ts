import { Injectable } from '@nestjs/common';
import { launch } from "puppeteer"
// import chromium from 'chrome-aws-lambda';
import { Readable } from 'stream';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async makePdf():Promise<any>{
    const html = `
    <style>
    body {
        font-family: Inter, sans-serif;
        font-max-size:  14px;
    }
    .right {
        text-align: right;
    }
    .width-50 {
        width: 50%;
    }
    .mb-10 {
        margin-bottom: 10px;
    }
    .container {
        width: 730px;
        margin: auto;
        border: solid 2px #f5f5f5;
        min-height: 800px;
        padding: 15px;
    }
    .container .header {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .container .header .company-name {
        margin-top: 10px;
        color: #009efa;
        font-size: 18px;
        font-weight: bold;
    }
    .invoice-ref-row {
        display: flex;
        justify-content: space-between;
    }
    .invoice-address-title {
        font-weight: bold;
        font-size: 16px;
        border-bottom: solid 2px #000;
        display: flex;
        justify-content: space-between;
        padding-bottom: 5px;
    }
    .invoice-address {
        display: flex;
        justify-content: space-between;
    }
    .product-title {
        background-color: #f5f5f5;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        width: 100%;
        padding: 12px 0 7px 0;
    }
    .product-item {
        display: flex;
        margin-bottom: 25px;
    }
    .product-item .product-item-picture {
        width: 20%;
        display: flex;
        align-items: center;
    }
    .product-item .product-item-info {
        width: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .product-item .product-item-price {
        width: 20%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
        padding-right: 20px;
    }
    .product-item .product-item-info .product-item-info-name {
        font-weight: bold;
        font-size: 16px;
        color: #211e1e;
    }
    .product-item .product-item-info .product-item-info-options {
        color: grey;
        font-size: 13px;
    }
    .table-order-price {
        width: 100%;
        border-collapse: collapse;
    }
    .table-order-price td {
        padding: 4px 15px;
    }
    .footer {
        text-align: center;
        width: 100%;
        font-size: 12px;
    }
</style>

<div class="container">
    <div class="header">
        <img src="/logo.svg" alt="Logo" />
        <div class="company-name">E-STORE</div>
    </div>
    <div style="height: 20px"></div>
    <div class="invoice-ref">
        <div class="invoice-ref-row">
            <div><b>Customer</b>: {{ order.user.firstName }} {{ order.user.lastName }}</div>
            <div><b>Date</b>: {{date order.createdAt}}</div>
        </div>
        <div style="height: 15px"></div>
        <div class="invoice-ref-row right">
            <div><b>Reference</b>: <a href="https://blog.tericcabrel.com">{{ order.reference }}</a></div>
        </div>
    </div>
    <div style="height: 30px"></div>
    <div class="invoice-address-title">
        <div class="width-50">SHIPPING ADDRESS</div>
        <div class="right width-50">BILLING ADDRESS</div>
    </div>
    <div style="height: 10px"></div>
    <div class="invoice-address">
        <div class="invoice-address-shipping width-50">
            <div class="mb-10">{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</div>
            <div class="mb-10">{{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}</div>
            <div class="mb-10">{{ order.shippingAddress.postalCode }}, {{ order.shippingAddress.street }}</div>
        </div>
        <div class="invoice-address-shipping width-50 right">
            <div class="mb-10">{{ order.billingAddress.firstName }} {{ order.billingAddress.lastName }}</div>
            <div class="mb-10">{{ order.billingAddress.city }}, {{ order.billingAddress.country }}</div>
            <div class="mb-10">{{ order.billingAddress.postalCode }}, {{ order.billingAddress.street }}</div>
        </div>
    </div>
    <div style="height: 20px"></div>
    <div class="product-title">
        PRODUCTS
    </div>
    <div style="height: 20px"></div>
    <div class="products">
        {{#each order.items}}
        <div class="product-item">
            <div class="product-item-picture">
                <img src="{{ this.productPicture }}" width="80" height="80" alt="product-picture" />
            </div>
            <div class="product-item-info">
                <div class="product-item-info-name">{{ this.productName }}</div>
                <div style="height: 8px"></div>
                <div class="product-item-info-options">
                    <span style="padding-right: 50px">{{ this.productOptions.[0].[0] }}: <b>{{ this.productOptions.[0].[1] }}</b></span>
                    <span>{{ this.productOptions.[1].[0] }}: <b>{{ this.productOptions.[1].[1] }}</b></span>
                </div>
            </div>
            <div class="product-item-price">
                <div>Qty: {{ this.quantity }}</div>
                <div style="height: 8px"></div>
                <div><b>€{{round this.price }}</b></div>
            </div>
        </div>
        {{/each}}
    </div>
    <div style="margin-top: 20px; border-bottom: solid 2px #f5f5f5"></div>
    <div style="height: 20px"></div>
    <table border="1" class="table-order-price">
        <tbody>
        <tr>
            <td>Subtotal</td>
            <td class="right">€{{round orderSubTotal }}</td>
        </tr>
        <tr>
            <td>Shipping</td>
            <td class="right">€{{round order.shippingAmount }}</td>
        </tr>
        <tr>
            <td>Sales Tax</td>
            <td class="right">€{{round order.taxAmount }}</td>
        </tr>
        <tr>
            <td style="padding-top: 10px"><b>TOTAL</b></td>
            <td style="padding-top: 10px" class="right"><b>€{{round order.totalAmount }}</b></td>
        </tr>
        </tbody>
    </table>
    <div style="height: 30px"></div>
    <div class="footer">&copy; 2021 E-Store Ltd.</div>
</div>
    `
    const browser = await launch({
      headless: true,
      userDataDir: '/dev/null',
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath,
    })
    const page = await browser.newPage()
    await page.setContent(html, {
      waitUntil: 'domcontentloaded'
    })
    const buffer = await page.pdf({
      format: 'A4'
    })
    await page.setContent(html);
    return buffer.toString('base64');
  }

  async printPdf(): Promise<Buffer> {
    return await this.makePdf()
  }
  
  getReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();
  
    stream.push(buffer);
    stream.push(null);
  
    return stream;
  }
}
