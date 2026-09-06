const bcrypt = require('bcrypt');
const prisma = require('./prisma');

const APPLICATION_ROLES = ['user', 'professional', 'admin'];

async function bootstrapIdentityData({ requireAdmin = false } = {}) {
  await Promise.all(APPLICATION_ROLES.map(role_type => prisma.roles.upsert({ where: { role_type }, update: {}, create: { role_type } })));
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    if (requireAdmin) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required to seed an administrator');
    console.warn('Admin bootstrap skipped: set ADMIN_EMAIL and ADMIN_PASSWORD for fresh deployments.');
    return { created: false, reason: 'credentials-not-configured' };
  }
  if (password.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters');
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== 'admin' || existing.userscol === 'revoked') await prisma.users.update({ where: { idusers: existing.idusers }, data: { role: 'admin', userscol: 'active' } });
    return { created: false, userId: existing.idusers };
  }
  const user = await prisma.users.create({ data: { email, password: await bcrypt.hash(password, 12), role: 'admin', userscol: 'active' } });
  return { created: true, userId: user.idusers };
}

async function seedReferenceCountries() {
  await Promise.all([
    ['Kenya', 'KEN'], ['Mexico', 'MEX'], ['India', 'IND'], ['Italy', 'ITA'], ['Ethiopia', 'ETH'],
  ].map(([name, code]) => prisma.countries.upsert({ where: { code }, update: {}, create: { name, code, description: `Explore foods and meals associated with ${name}.` } })));
}

module.exports = { APPLICATION_ROLES, bootstrapIdentityData, seedReferenceCountries };
