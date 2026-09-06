const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { profileData, profileView } = require('../globals/helpers/professional_profile');
const full = { first_name: ' Jane ', last_name: ' Doe ', jobs: ['Dietitian', 'Trainer', 'Dietitian'], bio: 'About my work', image_url: 'https://example.com/photo.jpg' };
test('profiles support multiple jobs and expose only public fields', () => {
  const data = profileData(full, true);
  assert.equal(data.first_name, 'Jane');
  assert.deepEqual(data.jobs, ['Dietitian', 'Trainer']);
  const view = profileView({ ...data, idusers: 1, email: 'private@example.com', password: 'secret', refresh_token: 'secret', role: 'professional' });
  assert.equal(view.id, 1);
  assert.equal(Object.hasOwn(view, 'email'), false);
  assert.equal(Object.hasOwn(view, 'password'), false);
  assert.equal(Object.hasOwn(view, 'refresh_token'), false);
});
test('invalid or missing professional profile fields are rejected', () => {
  for (const patch of [{ first_name: ' ' }, { last_name: 2 }, { jobs: [] }, { jobs: [''] }, { jobs: 'Trainer' }, { jobs: ['x'.repeat(101)] }, { bio: 'x'.repeat(5001) }, { image_url: 'javascript:alert(1)' }]) assert.throws(() => profileData({ ...full, ...patch }, true));
  assert.deepEqual(profileData({}, false), {});
});
function planController(prisma) {
  const sandbox = { exports: {}, require: name => name.includes('models/prisma') ? prisma : name.includes('custom_success') ? { getSuccessMessage: (_status, data) => data } : Error };
  vm.runInNewContext(fs.readFileSync(require.resolve('../controller/meal_plan_time/meal_plan_time'), 'utf8'), sandbox);
  return sandbox.exports;
}
test('professional plan descriptions are required on create and protected on edit', async () => {
  let saved;
  const prisma = { users: { findUnique: async () => ({ role: 'professional' }) }, mealplantime: { findUnique: async ({ where }) => where.idmealPlanWeek ? { description: 'Existing detailed description', users: { role: 'professional' } } : null, findFirst: async () => null, create: async ({ data }) => { saved = data; return data; }, update: async ({ data }) => { saved = data; return data; } } };
  const controller = planController(prisma);
  const res = { status: () => ({ send: () => {} }) };
  await assert.rejects(controller.createMealplanTime({ userId: 1, body: { mealPlanName: 'Example' } }, res), /description/);
  await controller.createMealplanTime({ userId: 1, body: { mealPlanName: 'Example', description: 'A detailed plan description' } }, res);
  assert.equal(saved.description, 'A detailed plan description');
  await assert.rejects(controller.updateMealplanTime({ params: { id: '1' }, body: { description: '' } }, res), /description/);
  await controller.updateMealplanTime({ params: { id: '1' }, body: { description: 'Updated detailed description' } }, res);
  assert.equal(saved.description, 'Updated detailed description');
});
