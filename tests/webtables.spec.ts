import { test } from '@playwright/test';
import { WebTablesPage, UserRecord } from '../pages/WebTablesPage';

test('creates, filters, updates, and deletes a WebTables record', async ({ page }) => {
  const webTables = new WebTablesPage(page);

  const testUser: UserRecord = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    age: '30',
    salary: '50000',
    department: 'QA',
  };

  const email = 'test@example.com';
  const updatedSalary = '65000';

  // 1. Navigate to WebTables.
  await webTables.navigate();

  // 2. Add the requested record.
  await webTables.addRecord(testUser);

  // 3. Search for test@example.com and verify exactly one matching row.
  await webTables.verifyMatchingRows(email, 1);

  // 4. Edit the new record and update its salary.
  await webTables.searchAndClickEditPath(email);
  await webTables.updateSalary(updatedSalary);

  // 5. Verify the updated salary for test@example.com.
  await webTables.verifyUserSalary(email, updatedSalary);

  // 6. Delete the record and verify no matching rows remain.
  await webTables.deleteRecord(email);
  await webTables.verifyMatchingRows(email, 0);
});