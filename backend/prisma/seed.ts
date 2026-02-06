import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create plans
  const plans = [
    {
      name: 'Free',
      slug: 'free',
      price: 0,
      currency: 'USD',
      maxStores: 1,
      maxProductsPerStore: 10,
      maxOrdersPerMonth: 50,
      maxAiGenerations: 50,
      customDomain: false,
      multiCurrency: false,
      whatsappIntegration: false,
      analyticsAdvanced: false,
      conversionAPI: false,
      removeBranding: false,
      prioritySupport: false,
    },
    {
      name: 'Starter',
      slug: 'starter',
      price: 2900, // $29
      currency: 'USD',
      maxStores: 3,
      maxProductsPerStore: 200,
      maxOrdersPerMonth: 1000,
      maxAiGenerations: 500,
      customDomain: false,
      multiCurrency: false,
      whatsappIntegration: false,
      analyticsAdvanced: false,
      conversionAPI: true,
      removeBranding: false,
      prioritySupport: false,
    },
    {
      name: 'Pro',
      slug: 'pro',
      price: 7900, // $79
      currency: 'USD',
      maxStores: 10,
      maxProductsPerStore: 999999,
      maxOrdersPerMonth: 999999,
      maxAiGenerations: 2000,
      customDomain: true,
      multiCurrency: true,
      whatsappIntegration: true,
      analyticsAdvanced: true,
      conversionAPI: true,
      removeBranding: true,
      prioritySupport: true,
    },
    {
      name: 'Agency',
      slug: 'agency',
      price: 19900, // $199
      currency: 'USD',
      maxStores: 50,
      maxProductsPerStore: 999999,
      maxOrdersPerMonth: 999999,
      maxAiGenerations: 10000,
      customDomain: true,
      multiCurrency: true,
      whatsappIntegration: true,
      analyticsAdvanced: true,
      conversionAPI: true,
      removeBranding: true,
      prioritySupport: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
    console.log(`✅ Created plan: ${plan.name}`);
  }

  // Get or create a default workspace for currencies
  const defaultWorkspace = await prisma.workspace.findFirst();
  
  if (defaultWorkspace) {
    // Create default currencies
    const currencies = [
      {
        workspaceId: defaultWorkspace.id,
        code: 'SAR',
        name: 'Saudi Riyal',
        symbol: 'ر.س',
        isActive: true,
      },
      {
        workspaceId: defaultWorkspace.id,
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        isActive: true,
      },
      {
        workspaceId: defaultWorkspace.id,
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        isActive: true,
      },
      {
        workspaceId: defaultWorkspace.id,
        code: 'AED',
        name: 'UAE Dirham',
        symbol: 'د.إ',
        isActive: true,
      },
    ];

    for (const currency of currencies) {
      await prisma.currency.upsert({
        where: {
          workspaceId_code: {
            workspaceId: currency.workspaceId,
            code: currency.code,
          },
        },
        update: currency,
        create: currency,
      });
      console.log(`✅ Created currency: ${currency.code} - ${currency.name}`);
    }
  } else {
    console.log('⚠️  No workspace found, skipping currency seeding');
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
