import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔒 Enabling Row Level Security (RLS) on all tables...');

  // Enable RLS on each table
  const tables = ['Product', 'ProductImage', 'ProductVariant', 'Category', 'Order', 'OrderItem', 'DeliveryFee'];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`ALTER TABLE public."${table}" ENABLE ROW LEVEL SECURITY;`);
    console.log(`  ✅ RLS enabled on ${table}`);
  }

  // Create service_role policies (allows Prisma server-side access to bypass RLS)
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`
        CREATE POLICY service_role_all ON public."${table}"
        FOR ALL TO service_role
        USING (true)
        WITH CHECK (true);
      `);
      console.log(`  ✅ Policy created for ${table}`);
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log(`  ℹ️  Policy already exists for ${table}, skipping`);
      } else {
        throw e;
      }
    }
  }

  // Also allow anonymous read access for products, categories, delivery fees (public data)
  const publicReadTables = ['Product', 'ProductImage', 'ProductVariant', 'Category', 'DeliveryFee'];
  for (const table of publicReadTables) {
    try {
      await prisma.$executeRawUnsafe(`
        CREATE POLICY public_read ON public."${table}"
        FOR SELECT TO anon, authenticated
        USING (true);
      `);
      console.log(`  ✅ Public read policy for ${table}`);
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log(`  ℹ️  Public read policy already exists for ${table}`);
      } else {
        throw e;
      }
    }
  }

  console.log('\n🎉 Done! All RLS policies configured successfully.');
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
