import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

export async function GET() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1200, height: 900 },
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  })

  const page = await browser.newPage()

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  await page.goto(`${origin}/attend/program?print=1`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' },
  })

  await browser.close()

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="KenyaDistrictConference2026-Programme.pdf"',
    },
  })
}