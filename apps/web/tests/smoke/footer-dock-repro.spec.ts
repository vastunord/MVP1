import { expect, test } from '@playwright/test';

test('footer legal text is not obscured at the end of a mobile page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.addInitScript(() => {
    localStorage.setItem('vn-cookie-choices', JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem('vn-newsletter-display', JSON.stringify({ version: 1, state: 'confirmed' }));
  });
  await page.goto('/en');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const result = await page.locator('.mk-footer small').evaluate((node) => {
    const r = node.getBoundingClientRect();
    return [...document.querySelectorAll('.vn-cookie-dock, .vn-prana-dock')].map(d => {
      const b = d.getBoundingClientRect();
      return { overlap: r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top, rect: [r.top, r.bottom], dock: [b.top, b.bottom] };
    });
  });
  expect(result.every(item => !item.overlap), JSON.stringify(result)).toBe(true);
});
