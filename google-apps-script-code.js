// Google Apps Script для Hungry Bot
// Правильно обробляє CORS та preflight запити

// ID вашої Google таблиці
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Leads';

/**
 * Обробляє GET запити (для тестування)
 */
function doGet(e) {
  return createCORSResponse({
    status: 200,
    data: {
      message: 'Hungry Bot Webhook активний',
      timestamp: new Date().toISOString(),
      status: 'success'
    }
  });
}

/**
 * Обробляє POST запити (основна логіка форми)
 */
function doPost(e) {
  try {
    // Логуємо вхідний запит
    console.log('📨 Отримано POST запит:', JSON.stringify(e));
    
    // Парсимо дані з запиту
    let formData;
    try {
      formData = JSON.parse(e.postData.contents);
    } catch (parseError) {
      console.error('❌ Помилка парсингу JSON:', parseError);
      return createCORSResponse({
        status: 400,
        data: {
          success: false,
          error: 'Неправильний формат JSON',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Валідуємо обов'язкові поля
    if (!formData.problem || !formData.cook_freq || !formData.tg_ok || 
        !formData.tone || !formData.style_preference || !formData.primary_goal || 
        !formData.payment_willingness || !formData.fair_price || !formData.consent) {
      return createCORSResponse({
        status: 400,
        data: {
          success: false,
          error: 'Відсутні обов\'язкові поля',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Перевіряємо згоду користувача
    if (formData.consent !== true) {
      return createCORSResponse({
        status: 400,
        data: {
          success: false,
          error: 'Необхідна згода з умовами',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Записуємо дані в таблицю
    const result = writeToSpreadsheet(formData);
    
    if (result.success) {
      console.log('✅ Дані успішно записано в таблицю');
      return createCORSResponse({
        status: 200,
        data: {
          success: true,
          message: 'Дані успішно збережено',
          timestamp: new Date().toISOString(),
          leadId: result.leadId
        }
      });
    } else {
      console.error('❌ Помилка запису в таблицю:', result.error);
      return createCORSResponse({
        status: 500,
        data: {
          success: false,
          error: 'Помилка збереження даних',
          timestamp: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('❌ Критична помилка в doPost:', error);
    return createCORSResponse({
      status: 500,
      data: {
        success: false,
        error: 'Внутрішня помилка сервера',
        timestamp: new Date().toISOString()
      }
    });
  }
}

/**
 * Обробляє OPTIONS запити (preflight для CORS)
 */
function doOptions(e) {
  console.log('🔄 Обробка preflight OPTIONS запиту');
  
  return createCORSResponse({
    status: 200,
    data: {
      message: 'Preflight запит оброблено',
      timestamp: new Date().toISOString()
    },
    isPreflight: true
  });
}

/**
 * Створює відповідь з правильними CORS заголовками
 */
function createCORSResponse({ status, data, isPreflight = false }) {
  const response = ContentService.createTextOutput();
  
  // Встановлюємо тип контенту
  response.setMimeType(ContentService.MimeType.JSON);
  
  // Встановлюємо статус
  response.setHttpStatusCode(status);
  
  // Додаємо CORS заголовки
  response.addHeader('Access-Control-Allow-Origin', '*');
  response.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.addHeader('Access-Control-Max-Age', '86400'); // 24 години
  
  // Для preflight запитів додаємо додаткові заголовки
  if (isPreflight) {
    response.addHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  // Встановлюємо тіло відповіді
  response.setContent(JSON.stringify(data));
  
  return response;
}

/**
 * Записує дані в Google таблицю
 */
function writeToSpreadsheet(formData) {
  try {
    // Отримуємо таблицю
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Аркуш не знайдено:', SHEET_NAME);
      return { success: false, error: 'Аркуш не знайдено' };
    }
    
    // Підготовуємо дані для запису
    const rowData = [
      new Date(), // Timestamp
      formData.email || '',
      formData.telegram || '',
      formData.problem,
      formData.cook_freq,
      formData.tg_ok,
      formData.tone,
      formData.blocker || '',
      formData.style_preference,
      formData.primary_goal,
      formData.payment_willingness,
      formData.fair_price,
      formData.consent ? 'Так' : 'Ні',
      formData.utm_source || '',
      formData.utm_medium || '',
      formData.utm_campaign || '',
      formData.referrer || '',
      formData.landing_variant || 'A'
    ];
    
    // Записуємо дані
    sheet.appendRow(rowData);
    
    // Отримуємо ID рядка для відстеження
    const lastRow = sheet.getLastRow();
    const leadId = `LEAD_${Date.now()}_${lastRow}`;
    
    console.log('✅ Дані записано в рядок:', lastRow);
    
    return { 
      success: true, 
      leadId: leadId,
      rowNumber: lastRow 
    };
    
  } catch (error) {
    console.error('❌ Помилка запису в таблицю:', error);
    return { 
      success: false, 
      error: error.toString() 
    };
  }
}

/**
 * Тестова функція для перевірки роботи скрипту
 */
function testScript() {
  console.log('🧪 Тестування скрипту...');
  
  // Тестуємо створення CORS відповіді
  const testResponse = createCORSResponse({
    status: 200,
    data: { message: 'Тест успішний' }
  });
  
  console.log('✅ Тест CORS відповіді пройдено');
  
  // Тестуємо підключення до таблиці
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (sheet) {
      console.log('✅ Підключення до таблиці успішне');
      console.log('📊 Кількість рядків:', sheet.getLastRow());
    } else {
      console.log('⚠️ Аркуш не знайдено');
    }
  } catch (error) {
    console.error('❌ Помилка підключення до таблиці:', error);
  }
  
  console.log('🏁 Тестування завершено');
}
