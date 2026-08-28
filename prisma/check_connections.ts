import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Checking active connections by database and application name...');
  const connections: any[] = await prisma.$queryRaw`
    SELECT datname, usename, application_name, client_addr, count(*) 
    FROM pg_stat_activity 
    GROUP BY datname, usename, application_name, client_addr;
  `;
  console.log('Connections:');
  
  // Format BigInt values to numbers/strings so they can be JSON serialized
  const formattedConnections = connections.map(c => {
    const formatted: any = {};
    for (const key in c) {
      if (typeof c[key] === 'bigint') {
        formatted[key] = c[key].toString();
      } else {
        formatted[key] = c[key];
      }
    }
    return formatted;
  });
  console.log(JSON.stringify(formattedConnections, null, 2));

  console.log('\nChecking total connection limits...');
  const limit: any[] = await prisma.$queryRaw`
    SELECT name, setting FROM pg_settings WHERE name = 'max_connections';
  `;
  console.log('Max Connections Limit:');
  console.log(JSON.stringify(limit, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
