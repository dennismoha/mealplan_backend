const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function response() { return { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } }; }
test('members can edit their own plan but cannot edit another owner’s plan', async () => {
  const sandbox = { exports: {}, module: { exports: {} }, require: () => ({ mealplantime: { findFirst: async () => ({ owner_user_id: 3 }) } }) };
  vm.runInNewContext(fs.readFileSync(require.resolve('../middlewares/authorization/meal_plan_ownership'), 'utf8'), sandbox);
  const middleware = sandbox.module.exports.requireMealPlanOwnership('plan-key');
  let passed = false; const res = response();
  await middleware({ roles: 'user', userId: 3, body: { mealplan_key: 'plan' }, params: {} }, res, () => { passed = true; });
  assert.equal(passed, true); passed = false;
  await middleware({ roles: 'user', userId: 4, body: { mealplan_key: 'plan' }, params: {} }, res, () => { passed = true; });
  assert.equal(res.code, 403); assert.equal(passed, false);
});
test('a professional cannot edit someone else’s dish or a legacy unowned dish', async () => {
  for (const owner of [8, null]) {
    const prisma = { mealtype: { findUnique: async () => ({ owner_user_id: owner, meal_kind: 'dish' }) } };
    const sandbox = { exports: {}, require: name => name === 'uuid' ? { v4: () => 'id' } : prisma };
    vm.runInNewContext(fs.readFileSync(require.resolve('../controller/meal_type/meal_type'), 'utf8'), sandbox);
    const res = response();
    await sandbox.exports.saveEditMealType({ roles: 'professional', userId: 2, params: { id: 'dish' }, body: { mealName: 'Changed' } }, res);
    assert.equal(res.code, 403);
  }
});
