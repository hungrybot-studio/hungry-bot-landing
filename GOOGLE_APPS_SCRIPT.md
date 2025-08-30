# 📊 Google Apps Script Setup для Hungry Bot

Цей файл містить інструкції для налаштування Google Apps Script для збору даних з форми Hungry Bot.

## 🚀 Швидкий старт

### 1. Створення Google Sheet

1. Відкрийте [Google Sheets](https://sheets.google.com)
2. Створіть новий документ з назвою "Hungry Bot Leads"
3. Додайте наступні заголовки в першому рядку:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Email | Telegram | Problem | Cook Frequency | Telegram OK | Tone | Blocker | Style Preference | Primary Goal | Payment Willingness | Fair Price | UTM Source | UTM Medium | UTM Campaign | Referrer | Landing Variant |

### 2. Створення Google Apps Script

1. Відкрийте [Google Apps Script](https://script.google.com)
2. Натисніть "New project"
3. Перейменуйте проект на "Hungry Bot Leads Handler"
4. Замініть весь код на наступний:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName('Hungry Bot Leads');
    if (!sheet) {
      throw new Error('Sheet "Hungry Bot Leads" not found');
    }
    
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.problem || !data.cook_freq || !data.tg_ok || !data.tone || 
        !data.style_preference || !data.primary_goal || !data.payment_willingness || 
        !data.fair_price) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          ok: false, 
          error: 'Missing required fields' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Prepare row data
    const rowData = [
      new Date(), // Timestamp
      data.email || '', // Email
      data.telegram || '', // Telegram
      data.problem || '', // Problem
      data.cook_freq || '', // Cook Frequency
      data.tg_ok || '', // Telegram OK
      data.tone || '', // Tone
      data.blocker || '', // Blocker
      data.style_preference || '', // Style Preference
      data.primary_goal || '', // Primary Goal
      data.payment_willingness || '', // Payment Willingness
      data.fair_price || '', // Fair Price
      data.utm_source || '', // UTM Source
      data.utm_medium || '', // UTM Medium
      data.utm_campaign || '', // UTM Campaign
      data.referrer || '', // Referrer
      data.landing_variant || 'A' // Landing Variant
    ];
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    // Log success
    console.log('Lead submitted successfully:', data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing lead:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        ok: false, 
        error: error.message 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Hungry Bot Leads API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Test function for development
function testLeadSubmission() {
  const testData = {
    problem: 'Не знаю що готувати',
    cook_freq: 'Кожен день',
    tg_ok: 'Так',
    tone: 'З гумором',
    blocker: 'Недостатньо часу',
    style_preference: 'Швидко та смачно',
    primary_goal: 'Економити час',
    payment_willingness: 'Так',
    fair_price: '5$',
    email: 'test@example.com',
    telegram: '@testuser'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}
```

### 3. Налаштування Web App

1. Натисніть "Deploy" → "New deployment"
2. Виберіть "Web app"
3. Налаштуйте:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Натисніть "Deploy"
5. Скопіюйте URL (виглядає як `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

### 4. Додавання URL в проект

1. Створіть `.env.local` файл в корені проекту Hungry Bot
2. Додайте:

```env
NEXT_PUBLIC_LEADS_WEBHOOK=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 🔧 Налаштування додаткових функцій

### Автоматичне форматування

Додайте цю функцію для автоматичного форматування:

```javascript
function formatSheet() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Hungry Bot Leads');
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, 17);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f4f6');
  headerRange.setHorizontalAlignment('center');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, 17);
  
  // Add borders
  const dataRange = sheet.getDataRange();
  dataRange.setBorder(true, true, true, true, true, true);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}
```

### Автоматичне очищення

```javascript
function cleanupOldLeads() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Hungry Bot Leads');
  const data = sheet.getDataRange().getValues();
  
  // Keep only last 1000 leads
  if (data.length > 1001) {
    const rowsToDelete = data.length - 1001;
    sheet.deleteRows(2, rowsToDelete);
  }
}

// Run cleanup weekly
function createWeeklyTrigger() {
  ScriptApp.newTrigger('cleanupOldLeads')
    .timeBased()
    .everyWeeks(1)
    .create();
}
```

## 📊 Моніторинг та логування

### Перегляд логів

1. В Apps Script натисніть "Executions" в лівому меню
2. Переглядайте логи виконання функцій
3. Перевіряйте помилки та успішні запити

### Тестування API

Використовуйте [Postman](https://postman.com) або [cURL](https://curl.se) для тестування:

```bash
curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "problem": "Тестовий запит",
    "cook_freq": "Кожен день",
    "tg_ok": "Так",
    "tone": "З гумором",
    "blocker": "Тест",
    "style_preference": "Тест",
    "primary_goal": "Тест",
    "payment_willingness": "Так",
    "fair_price": "5$"
  }'
```

## 🚨 Безпека та обмеження

### Обмеження Google Apps Script

- **Quota**: 20,000 запитів на день
- **Timeout**: 6 хвилин на запит
- **Memory**: 50MB на запит
- **Rate limiting**: 100 запитів на хвилину

### Рекомендації

1. **Валідація**: Завжди валідуйте вхідні дані
2. **Логування**: Логуйте всі помилки для діагностики
3. **Моніторинг**: Регулярно перевіряйте логи виконання
4. **Backup**: Регулярно експортуйте дані з Google Sheets

## 🔄 Оновлення та підтримка

### Регулярні завдання

1. **Щотижня**: Перевірка логів та помилок
2. **Щомісяця**: Очищення старих даних
3. **Кожні 3 місяці**: Оновлення коду та функціоналу

### Troubleshooting

**Помилка "Sheet not found"**
- Перевірте назву листа "Hungry Bot Leads"
- Переконайтеся, що лист активний

**Помилка "Missing required fields"**
- Перевірте структуру даних у формі
- Переконайтеся, що всі обов'язкові поля заповнені

**Помилка "Quota exceeded"**
- Дочекайтеся скидання лімітів (наступний день)
- Розгляньте можливість розподілу навантаження

---

**Hungry Bot** — збираємо дані ефективно! 📊✨
