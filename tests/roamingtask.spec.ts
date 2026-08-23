import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ThailandPlansPage } from '../pages/ThailandPlansPage';

test('shows the current details for Thailand third plan in Euro', async ({ page }) => {
  const homePage = new HomePage(page);
  const thailandPlansPage = new ThailandPlansPage(page);

  await homePage.open();
  await homePage.selectEuro();
  await homePage.openThailandPlans();

  const thirdPlan = await thailandPlansPage.thirdPlan();
  await expect(thirdPlan).toContainText(/Thailand/i);
  await expect(thirdPlan).toContainText(/5\s*GB/i);
  await expect(thirdPlan).toContainText(/30\s*days/i);
  await expect(thirdPlan).toContainText(/Data only/i);

  const price = thirdPlan.getByText(/€\s*\d+[.,]\d{2}/).first();
  await expect(price).toBeVisible();
  expect((await price.textContent())?.trim()).toMatch(/€\s*\d+[.,]\d{2}/);
});