import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Checking active pg_stat_activity queries...');
  const activeQueries: any[] = await prisma.$queryRaw`
    SELECT pid, query, state, age(clock_timestamp(), query_start) as duration
    FROM pg_stat_activity
    WHERE state != 'idle' AND query NOT LIKE '%pg_stat_activity%'
    ORDER BY duration DESC;
  `;
  console.log('Active Queries:');
  console.log(JSON.stringify(activeQueries, null, 2));

  console.log('\nChecking locks...');
  const locks: any[] = await prisma.$queryRaw`
    SELECT
      coalesce(blockingl.relation::regclass::text,blockingl.locktype) as blocked_item,
      blockeda.pid AS blocked_pid,
      blockeda.query as blocked_query,
      blockedl.mode as blocked_mode,
      blockinga.pid AS blocking_pid,
      blockinga.query as blocking_query,
      blockingl.mode as blocking_mode
    FROM pg_catalog.pg_locks blockedl
    JOIN pg_catalog.pg_stat_activity blockeda ON blockeda.pid = blockedl.pid
    JOIN pg_catalog.pg_locks blockingl ON blockingl.relation = blockedl.relation AND blockingl.locktype = blockedl.locktype AND blockingl.pid != blockedl.pid
    JOIN pg_catalog.pg_stat_activity blockinga ON blockinga.pid = blockingl.pid
    WHERE NOT blockedl.granted;
  `;
  console.log('Locks:');
  console.log(JSON.stringify(locks, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
