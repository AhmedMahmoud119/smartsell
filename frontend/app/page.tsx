'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: '⚡',
      title: t('landing.features.speed.title'),
      description: t('landing.features.speed.description'),
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      icon: '🔒',
      title: t('landing.features.secure.title'),
      description: t('landing.features.secure.description'),
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      icon: '💳',
      title: t('landing.features.payments.title'),
      description: t('landing.features.payments.description'),
      gradient: 'from-blue-400 to-cyan-500',
    },
    {
      icon: '📊',
      title: t('landing.features.analytics.title'),
      description: t('landing.features.analytics.description'),
      gradient: 'from-purple-400 to-pink-500',
    },
    {
      icon: '📱',
      title: t('landing.features.mobile.title'),
      description: t('landing.features.mobile.description'),
      gradient: 'from-indigo-400 to-purple-500',
    },
    {
      icon: '🌍',
      title: t('landing.features.bilingual.title'),
      description: t('landing.features.bilingual.description'),
      gradient: 'from-rose-400 to-red-500',
    },
  ];

  const testimonials = [
    {
      name: t('landing.testimonials.testimonial1.name'),
      role: t('landing.testimonials.testimonial1.role'),
      image: 'https://ui-avatars.com/api/?name=Ahmed+Mohamed&background=3b82f6&color=fff&size=128',
      content: t('landing.testimonials.testimonial1.content'),
      rating: 5,
    },
    {
      name: t('landing.testimonials.testimonial2.name'),
      role: t('landing.testimonials.testimonial2.role'),
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff&size=128',
      content: t('landing.testimonials.testimonial2.content'),
      rating: 5,
    },
    {
      name: t('landing.testimonials.testimonial3.name'),
      role: t('landing.testimonials.testimonial3.role'),
      image: 'https://ui-avatars.com/api/?name=Mohamed+Alali&background=8b5cf6&color=fff&size=128',
      content: t('landing.testimonials.testimonial3.content'),
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: t('landing.faq.q1.question'),
      answer: t('landing.faq.q1.answer'),
    },
    {
      question: t('landing.faq.q2.question'),
      answer: t('landing.faq.q2.answer'),
    },
    {
      question: t('landing.faq.q3.question'),
      answer: t('landing.faq.q3.answer'),
    },
    {
      question: t('landing.faq.q4.question'),
      answer: t('landing.faq.q4.answer'),
    },
    {
      question: t('landing.faq.q5.question'),
      answer: t('landing.faq.q5.answer'),
    },
  ];

  return (
    <div className="min-h-screen bg-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('landing.title')}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition font-medium"
              >
                {t('landing.login')}
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                {t('landing.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                  🚀 {t('landing.hero.badge')}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                {t('landing.hero.title')}
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('landing.hero.titleHighlight')}
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                {t('landing.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-medium text-lg"
                >
                  {t('landing.hero.cta')}
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <button className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-medium text-lg">
                  {t('landing.hero.watchDemo')}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-4xl font-bold text-gray-900">1000+</div>
                  <div className="text-gray-600 mt-1 text-sm">{t('landing.hero.stats.stores')}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900">50K+</div>
                  <div className="text-gray-600 mt-1 text-sm">{t('landing.hero.stats.products')}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900">99.9%</div>
                  <div className="text-gray-600 mt-1 text-sm">{t('landing.hero.stats.uptime')}</div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-6xl">
                    🛒
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 bg-white"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                    {step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t(`landing.howItWorks.step${step}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`landing.howItWorks.step${step}.description`)}
                  </p>
                </div>
                {step < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing.pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('landing.pricing.free.name')}
              </h3>
              <p className="text-gray-600 mb-6">{t('landing.pricing.free.description')}</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">${t('landing.pricing.free.price')}</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {t('landing.pricing.free.features').map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-center font-medium"
              >
                {t('landing.pricing.free.cta')}
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8 relative hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                {t('landing.pricing.pro.popular')}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t('landing.pricing.pro.name')}
              </h3>
              <p className="text-blue-100 mb-6">{t('landing.pricing.pro.description')}</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">${t('landing.pricing.pro.price')}</span>
                <span className="text-blue-100">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {t('landing.pricing.pro.features').map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 px-6 bg-white text-blue-600 rounded-lg hover:shadow-xl transition text-center font-bold"
              >
                {t('landing.pricing.pro.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('landing.faq.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing.faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-gray-600 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('landing.cta.subtitle')}
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg"
          >
            {t('landing.cta.button')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {t('landing.title')}
          </div>
          <p className="text-gray-400 mb-6">
            {t('landing.footer.tagline')}
          </p>
          <div className="text-sm text-gray-500">
            {t('landing.footer.rights')}
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
