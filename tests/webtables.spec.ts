import { test } from '@playwright/test';
import { WebTablesPage, UserRecord } from '../pages/WebTablesPage';

test('Full WebTables flow with pre-edit salary assertion', async ({ page }) => {
  const webTables = new WebTablesPage(page);

  const testUser: UserRecord = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    age: '30',
    salary: '50000',
    department: 'QA',
  };

  const cierraEmail = 'cierra@example.com';
  const originalSalary = '10000';
  const updatedSalary = '50000';

  // Step 1: Navigate to WebTables
  await webTables.navigate();

  // Step 2: Add new record for test@example.com
  await webTables.addRecord(testUser);

  // Step 3: Search for cierra@example.com and click edit icon
  await webTables.searchAndClickEditPath(cierraEmail);

  // Step 4: Assert original salary is 10000 BEFORE updating
  await webTables.verifyUserSalary(cierraEmail, originalSalary);

  // Step 5: Update salary to 50000
  await webTables.updateSalary(updatedSalary);

  // Step 6: Assert salary updated to 50000 and close test
  await webTables.verifyUserSalary(cierraEmail, updatedSalary);
});