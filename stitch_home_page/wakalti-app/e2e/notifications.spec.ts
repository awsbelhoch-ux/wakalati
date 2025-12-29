import { test, expect, request } from '@playwright/test';

test('notifications panel updates when server emits', async ({ page }) => {
  await page.goto('/');
  // Navigate to notifications page or component
  await page.goto('/patient/notifications');

  // Ensure bell is present
  const bell = page.locator('button[aria-label="Notifications"]');
  await expect(bell).toBeVisible();

  // Trigger server-side emit via ws-server HTTP endpoint
  const api = 'http://localhost:4000/emit';
  await request.newContext().post(api, {
    data: {
      event: 'notification',
      payload: { title: 'E2E test notification', body: 'This came from ws-server' }
    }
  });

  // Wait for UI to reflect new notification
  const notif = page.locator('text=E2E test notification');
  await expect(notif).toBeVisible({ timeout: 5000 });
});
