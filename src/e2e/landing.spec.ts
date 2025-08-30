import { test, expect } from '@playwright/test';

test.describe('Hungry Bot Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Рецепти, як ніколи раніше/ })).toBeVisible();
    await expect(page.getByText(/Hungry Bot — твій кулінарний асистент у Telegram/)).toBeVisible();
  });

  test('should open lead form when CTA button is clicked', async ({ page }) => {
    const ctaButton = page.getByRole('button', { name: /Отримати раннє запрошення/ }).first();
    await ctaButton.click();
    
    await expect(page.getByRole('heading', { name: /Чи потрібен тобі такий бот/ })).toBeVisible();
  });

  test('should display all main sections', async ({ page }) => {
    // Hero
    await expect(page.getByRole('heading', { name: /Рецепти, як ніколи раніше/ })).toBeVisible();
    
    // Voice Teaser
    await expect(page.getByRole('heading', { name: /Послухай Hungry Bot/ })).toBeVisible();
    
    // Pain Points
    await expect(page.getByRole('heading', { name: /Це для тебе, якщо ти/ })).toBeVisible();
    
    // How It Works
    await expect(page.getByRole('heading', { name: /Як це працює/ })).toBeVisible();
    
    // Social Proof
    await expect(page.getByRole('heading', { name: /Нас уже тестують/ })).toBeVisible();
    
    // Voice Agent
    await expect(page.getByRole('heading', { name: /Голосовий агент/ })).toBeVisible();
    
    // What's Next
    await expect(page.getByRole('heading', { name: /Що буде далі/ })).toBeVisible();
    
    // Final CTA
    await expect(page.getByRole('heading', { name: /Спробуй — і забудеш про нудні рецепти/ })).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Privacy policy link in footer
    const privacyLink = page.getByRole('link', { name: /Політика конфіденційності/ });
    await expect(privacyLink).toBeVisible();
    
    await privacyLink.click();
    await expect(page.getByRole('heading', { name: /Політика конфіденційності/ })).toBeVisible();
  });

  test('should display voice agent section', async ({ page }) => {
    const voiceAgentSection = page.locator('section').filter({ hasText: /Голосовий агент/ });
    
    await expect(voiceAgentSection.getByText(/Отримай відповідь від Hungry Bot/)).toBeVisible();
    await expect(voiceAgentSection.getByRole('button', { name: /Почати розмову/ })).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await expect(page).toHaveTitle(/Hungry Bot - Рецепти, як ніколи раніше/);
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Hungry Bot — твій кулінарний асистент у Telegram/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu or responsive elements are working
    await expect(page.getByRole('heading', { name: /Рецепти, як ніколи раніше/ })).toBeVisible();
    
    // Verify CTA buttons are still accessible
    const ctaButtons = page.getByRole('button', { name: /Отримати раннє запрошення/ });
    await expect(ctaButtons.first()).toBeVisible();
  });
});

test.describe('Lead Form Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Open form
    await page.getByRole('button', { name: /Отримати раннє запрошення/ }).first().click();
  });

  test('should display form fields', async ({ page }) => {
    await expect(page.getByLabel(/Email/)).toBeVisible();
    await expect(page.getByLabel(/Telegram username/)).toBeVisible();
    await expect(page.getByLabel(/Чи часто у тебе виникає питання/)).toBeVisible();
    await expect(page.getByLabel(/Як часто ти готуєш/)).toBeVisible();
    await expect(page.getByLabel(/Чи зручно тобі отримувати повідомлення в Telegram/)).toBeVisible();
    await expect(page.getByLabel(/Який тон спілкування тобі подобається/)).toBeVisible();
  });

  test('should show validation errors for required fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /Надіслати й отримати ранній доступ/ });
    await submitButton.click();
    
    // Should show validation errors
    await expect(page.getByText(/Оберіть варіант відповіді/)).toBeVisible();
  });

  test('should close modal when escape key is pressed', async ({ page }) => {
    await page.keyboard.press('Escape');
    
    // Form should be hidden
    await expect(page.getByRole('heading', { name: /Чи потрібен тобі такий бот/ })).not.toBeVisible();
  });

  test('should close modal when backdrop is clicked', async ({ page }) => {
    // Click outside the modal content
    await page.locator('.fixed.inset-0').click();
    
    // Form should be hidden
    await expect(page.getByRole('heading', { name: /Чи потрібен тобі такий бот/ })).not.toBeVisible();
  });
});
