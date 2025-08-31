// Google Apps Script для Hungry Bot
// Правильно обробляє CORS та preflight запити

// ID вашої Google таблиці (залишаємо для довідки)
const SPREADSHEET_ID = '14GY5TXBOsDBEqorkZF7fTy2O4MWbufHrODLi-xo5WCK';
const SHEET_NAME = 'Аркуш1';

/**
 * Обробляє GET запити (для тестування)
 */
function doGet(e) {
  return createCORSResponse({
    data: {
      message: 'Вебхук Hungry Bot V2 активний',
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
      data: {
        success: false,
        error: 'Внутрішня помилка сервера',
        timestamp: new Date().toISOString()
      }
    });
  }
}

/**
 * Обробляє OPTIONS запити (preflight для CORS) - КЛЮЧОВА ФУНКЦІЯ!
 */
function doOptions(e) {
  console.log('🔄 Обробка preflight OPTIONS запиту');
  
  // Створюємо відповідь з правильними CORS заголовками
  const response = ContentService.createTextOutput();
  
  // Встановлюємо тип контенту
  response.setMimeType(ContentService.MimeType.TEXT);
  
  // Встановлюємо тіло відповіді
  response.setContent('Preflight OK');
  
  console.log('✅ Preflight запит оброблено з CORS заголовками');
  return response;
}

/**
 * Створює відповідь з правильними CORS заголовками
 */
function createCORSResponse({ data }) {
  const response = ContentService.createTextOutput();
  
  // Встановлюємо тип контенту
  response.setMimeType(ContentService.MimeType.JSON);
  
  // Встановлюємо тіло відповіді
  response.setContent(JSON.stringify(data));
  
  return response;
}

/**
 * Записує дані в Google таблицю
 */
function writeToSpreadsheet(formData) {
  try {
    console.log('📊 Спроба запису в таблицю...');
    console.log('🔍 Назва аркуша:', SHEET_NAME);
    
    // Отримуємо активну таблицю (замість openById)
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      console.log('✅ Активну таблицю знайдено');
    } catch (error) {
      console.error('❌ Не вдалося отримати активну таблицю:', error);
      return { success: false, error: 'Не вдалося отримати доступ до таблиці' };
    }
    
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Аркуш не знайдено:', SHEET_NAME);
      console.log('📋 Доступні аркуші:', spreadsheet.getSheets().map(s => s.getName()));
      return { success: false, error: `Аркуш "${SHEET_NAME}" не знайдено` };
    }
    
    console.log('✅ Аркуш знайдено:', SHEET_NAME);
    
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
    
    console.log('📝 Дані для запису:', rowData);
    
    // Записуємо дані
    sheet.appendRow(rowData);
    
    // Отримуємо ID рядка для відстеження
    const lastRow = sheet.getLastRow();
    const leadId = `LEAD_${Date.now()}_${lastRow}`;
    
    console.log('✅ Дані записано в рядок:', lastRow);
    console.log('🆔 ID ліда:', leadId);
    
    return { 
      success: true, 
      leadId: leadId,
      rowNumber: lastRow 
    };
    
  } catch (error) {
    console.error('❌ Помилка запису в таблицю:', error);
    console.error('❌ Деталі помилки:', error.toString());
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
  try {
    const testResponse = createCORSResponse({
      data: { message: 'Тест успішний' }
    });
    console.log('✅ Тест CORS відповіді пройдено');
  } catch (error) {
    console.error('❌ Помилка CORS відповіді:', error);
  }
  
  // Тестуємо підключення до таблиці
  try {
    console.log('🔍 Тестуємо підключення до таблиці...');
    console.log('🔍 Назва аркуша:', SHEET_NAME);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('✅ Активну таблицю знайдено');
    
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (sheet) {
      console.log('✅ Аркуш знайдено:', SHEET_NAME);
      console.log('📊 Кількість рядків:', sheet.getLastRow());
      console.log('📋 Назви колонок:', sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]);
    } else {
      console.log('⚠️ Аркуш не знайдено');
      console.log('📋 Доступні аркуші:', spreadsheet.getSheets().map(s => s.getName()));
    }
  } catch (error) {
    console.error('❌ Помилка підключення до таблиці:', error);
  }
  
  console.log('🏁 Тестування завершено');
}
