'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadFormSchema, type LeadFormSchema } from '@/lib/validators';
import { submitLeadForm } from '@/lib/forms';
import { getStoredUTMData } from '@/lib/utm';
import { trackFormOpen, trackFormSubmit } from '@/lib/analytics';
import { ConsentCheckbox } from './consent-checkbox';
import { CTAButton } from './cta-button';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Додаємо логування для діагностики
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 Форма відкрита, перевіряємо змінні середовища:');
      console.log('🌐 NEXT_PUBLIC_LEADS_WEBHOOK:', process.env.NEXT_PUBLIC_LEADS_WEBHOOK);
      console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<LeadFormSchema>({
    resolver: zodResolver(leadFormSchema),
    mode: 'onChange',
    defaultValues: {
      consent: false,
    },
  });

  const watchedEmail = watch('email');
  const watchedTelegram = watch('telegram');
  const watchedConsent = watch('consent');

  // Track form open
  useEffect(() => {
    if (isOpen) {
      trackFormOpen();
    }
  }, [isOpen]);

  // Set UTM data on form open
  useEffect(() => {
    if (isOpen) {
      const utmData = getStoredUTMData();
      // UTM data will be added to the payload during submission
    }
  }, [isOpen]);

  const onSubmit = async (data: LeadFormSchema) => {
    // Validate form before submission
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Add UTM data to payload
      const utmData = getStoredUTMData();
      const payload = {
        ...data,
        ...utmData,
      };

      // Додаємо логування для діагностики
      console.log('📤 Відправляємо дані форми:', payload);
      console.log('🔍 Перевіряємо поле consent:', payload.consent);
      console.log('🔍 Тип поля consent:', typeof payload.consent);

      const result = await submitLeadForm(payload);

      if (result.success) {
        setIsSuccess(true);
        trackFormSubmit(true);
        reset();
      } else {
        setSubmitError(result.error || 'Помилка відправки форми');
        trackFormSubmit(false, result.error);
      }
    } catch (error) {
      setSubmitError('Невідома помилка');
      trackFormSubmit(false, 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setIsSuccess(false);
      setSubmitError(null);
      reset();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {isSuccess ? '🎉 Дякуємо!' : 'Чи потрібен тобі такий бот?'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 transition-colors duration-200 text-2xl"
                  disabled={isSubmitting}
                >
                  ✕
                </button>
              </div>
              {!isSuccess && (
                <p className="text-primary-100 mt-2">
                  Заповни форму і отримай ранній доступ до Hungry Bot
                </p>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <SuccessContent onClose={handleClose} />
              ) : (
                <FormContent
                  register={register}
                  errors={errors}
                  watchedEmail={watchedEmail}
                  watchedTelegram={watchedTelegram}
                  watchedConsent={watchedConsent}
                  setValue={setValue}
                  onSubmit={handleSubmit(onSubmit)}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

function FormContent({
  register,
  errors,
  watchedEmail,
  watchedTelegram,
  watchedConsent,
  setValue,
  onSubmit,
  isSubmitting,
  submitError,
}: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Контактна інформація</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email (необов'язково)
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="input-field"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-2">
              Telegram username (необов'язково)
            </label>
            <input
              {...register('telegram')}
              type="text"
              id="telegram"
              className="input-field"
              placeholder="@username"
            />
            {errors.telegram && (
              <p className="text-red-600 text-sm mt-1">{errors.telegram.message}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          * Вкажи хоча б один з способів зв'язку
        </p>
      </div>

      {/* Problem & Frequency */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Твоя ситуація</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
              Чи часто у тебе виникає питання "що приготувати"?
            </label>
            <select {...register('problem')} id="problem" className="select-field">
              <option value="">Оберіть варіант</option>
              <option value="Так">Так, щодня</option>
              <option value="Іноді">Іноді, кілька разів на тиждень</option>
              <option value="Ні">Ні, рідко</option>
            </select>
            {errors.problem && (
              <p className="text-red-600 text-sm mt-1">{errors.problem.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cook_freq" className="block text-sm font-medium text-gray-700 mb-2">
              Як часто ти готуєш?
            </label>
            <select {...register('cook_freq')} id="cook_freq" className="select-field">
              <option value="">Оберіть варіант</option>
              <option value="Щодня">Щодня</option>
              <option value="Кілька разів на тиждень">Кілька разів на тиждень</option>
              <option value="Рідко">Рідко</option>
            </select>
            {errors.cook_freq && (
              <p className="text-red-600 text-sm mt-1">{errors.cook_freq.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Твої уподобання</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tg_ok" className="block text-sm font-medium text-gray-700 mb-2">
              Чи зручно тобі отримувати повідомлення в Telegram?
            </label>
            <select {...register('tg_ok')} id="tg_ok" className="select-field">
              <option value="">Оберіть варіант</option>
              <option value="Так">Так, дуже зручно</option>
              <option value="Ні">Ні, краще email</option>
            </select>
            {errors.tg_ok && (
              <p className="text-red-600 text-sm mt-1">{errors.tg_ok.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
              Який тон спілкування тобі подобається?
            </label>
            <select {...register('tone')} id="tone" className="select-field">
              <option value="">Оберіть варіант</option>
              <option value="Гумор">З гумором та жартами</option>
              <option value="Серйозно">Серйозно та по ділу</option>
              <option value="Комбо">Комбінований підхід</option>
            </select>
            {errors.tone && (
              <p className="text-red-600 text-sm mt-1">{errors.tone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Style & Goals */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="style_preference" className="block text-sm font-medium text-gray-700 mb-2">
              Який стиль приготування тобі подобається?
            </label>
            <select {...register('style_preference')} id="style_preference" className="select-field">
              <option value="">Оберіть варіант</option>
              <option value="Швидко">Швидко та просто</option>
              <option value="Бюджетно">Бюджетно та економно</option>
              <option value="Для сім'ї">Для сім'ї з дітьми</option>
              <option value="Для дієти">Здорова їжа та дієта</option>
              <option value="Креативно">Креативно та незвично</option>
            </select>
            {errors.style_preference && (
              <p className="text-red-600 text-sm mt-1">{errors.style_preference.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="primary_goal" className="block text-sm font-medium text-gray-700 mb-2">
              Яка твоя основна мета?
            </label>
            <select {...register('primary_goal')} id="primary_goal" className="select-field">
              <option value="">Оберіть варіант</option>
              <option value="Меню на тиждень">Планувати меню на тиждень</option>
              <option value="Дешеві рецепти">Знаходити дешеві рецепти</option>
              <option value="Фітнес-страви">Готувати фітнес-страви</option>
              <option value="Щось нове">Спробувати щось нове</option>
            </select>
            {errors.primary_goal && (
              <p className="text-red-600 text-sm mt-1">{errors.primary_goal.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Blocker */}
      <div>
        <label htmlFor="blocker" className="block text-sm font-medium text-gray-700 mb-2">
          Що заважає тобі готувати частіше? (необов'язково)
        </label>
        <textarea
          {...register('blocker')}
          id="blocker"
          rows={3}
          className="textarea-field"
          placeholder="Наприклад: немає часу, не знаю що готувати, складно знайти рецепти..."
        />
      </div>

      {/* Payment Willingness */}
      <div>
        <label htmlFor="payment_willingness" className="block text-sm font-medium text-gray-700 mb-2">
          Чи готові ви платити за послуги такого помічника?
        </label>
        <select {...register('payment_willingness')} id="payment_willingness" className="select-field">
          <option value="">Оберіть варіант</option>
          <option value="Так">Так, готовий платити</option>
          <option value="Ні">Ні, не готовий</option>
          <option value="Важко сказати">Важко сказати</option>
        </select>
        {errors.payment_willingness && (
          <p className="text-red-600 text-sm mt-1">{errors.payment_willingness.message}</p>
        )}
      </div>

      {/* Fair Price */}
      <div>
        <label htmlFor="fair_price" className="block text-sm font-medium text-gray-700 mb-2">
          Яка, на Вашу думку, була б справедлива вартість такого помічника на місяць?
        </label>
        <select {...register('fair_price')} id="fair_price" className="select-field">
          <option value="">Оберіть вартість</option>
          <option value="1$">1$</option>
          <option value="3$">3$</option>
          <option value="5$">5$</option>
          <option value="10$">10$</option>
        </select>
        {errors.fair_price && (
          <p className="text-red-600 text-sm mt-1">{errors.fair_price.message}</p>
        )}
      </div>

      {/* Consent */}
      <ConsentCheckbox
        checked={watchedConsent || false}
        onChange={(checked) => {
          setValue('consent', checked, { shouldValidate: true });
          console.log('✅ Consent встановлено:', checked);
        }}
        error={errors.consent?.message}
      />
      <input type="hidden" {...register('consent')} />

      {/* Submit Error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <span>⚠️</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <CTAButton
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        location="form_submit"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Відправляємо...</span>
          </div>
        ) : (
          '📝 Надіслати й отримати ранній доступ'
        )}
      </CTAButton>
    </form>
  );
}

function SuccessContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-4xl">🎉</span>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Заявку прийнято!
        </h3>
        <p className="text-gray-600">
          Дякуємо за інтерес до Hungry Bot. Ми зв'яжемося з тобою найближчим часом.
        </p>
      </div>

      <div className="space-y-4">
        <CTAButton
          onClick={() => window.open('https://t.me/hungrybot', '_blank')}
          variant="primary"
          size="lg"
          location="success_telegram"
          className="w-full"
        >
          Відкрити Telegram-бота
        </CTAButton>
        
        <CTAButton
          onClick={() => window.open('https://t.me/hungrybot_channel', '_blank')}
          variant="secondary"
          size="lg"
          location="success_channel"
          className="w-full"
        >
          Підписатися на приватний канал
        </CTAButton>
      </div>

      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        Закрити
      </button>
    </div>
  );
}
