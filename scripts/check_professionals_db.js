// Public directory integration checks; fixtures are always rolled back.
require('dotenv').config();
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const vm = require('node:vm');
const fs = require('node:fs');
const prisma = require('../models/prisma');
const helpers = require('../globals/helpers/professional_profile');
const rollback = new Error('ROLLBACK');
(async () => {
  try { await prisma.$transaction(async tx => {
    await tx.roles.upsert({ where: { role_type: 'professional' }, update: {}, create: { role_type: 'professional' } });
    const users = [];
    for (const status of ['active', 'active', 'revoked']) {
      users.push(await tx.users.create({ data: { email: `${randomUUID()}@x.test`, password: 'fixture', role: 'professional', userscol: status, first_name: 'Fixture', last_name: 'Professional', jobs: ['Trainer', 'Dietitian'], bio: 'Test profile', image_url: 'https://example.com/photo.jpg' } }));
    }
    for (const owner of [users[0], users[0], users[2]]) await tx.mealplantime.create({ data: { meal_plan_name: randomUUID(), owner_user_id: owner.idusers, description: 'Professional plan description' } });
    const dbModule = { module: { exports: {} }, require: name => name.includes('models/prisma') ? tx : Error };
    vm.runInNewContext(fs.readFileSync(require.resolve('../globals/services/db/meal_plan_db'), 'utf8'), dbModule);
    const module = { exports: {}, require: name => name.includes('models/prisma') ? tx : name.includes('professional_profile') ? helpers : dbModule.module.exports };
    vm.runInNewContext(fs.readFileSync(require.resolve('../controller/user_auth/professionals'), 'utf8'), module);
    let body; let status = 200;
    const res = { json: value => { body = value; }, status: value => { status = value; return res; } };
    await module.exports.list({}, res);
    const profile = body.professionals.find(p => p.id === users[0].idusers);
    assert.equal(profile.plan_count, 2);
    assert.equal(profile.jobs.length, 2);
    assert.equal(Object.hasOwn(profile, 'email'), false);
    assert.equal(Object.hasOwn(profile, 'password'), false);
    assert.ok(!body.professionals.some(p => p.id === users[1].idusers || p.id === users[2].idusers));
    await module.exports.detail({ params: { id: String(users[0].idusers) } }, res);
    assert.equal(body.plans.length, 2);
    assert.ok(body.plans.every(p => p.ownerUserId === users[0].idusers && p.description === 'Professional plan description'));
    await module.exports.detail({ params: { id: String(users[2].idusers) } }, res);
    assert.equal(status, 404);
    throw rollback;
  }); } catch (e) { if (e !== rollback) throw e; }
  console.log('Directory includes active professionals with plans only; profiles exclude private fields; selected plans and descriptions belong to the selected professional. Fixtures rolled back.');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
