const prisma = require('../../models/prisma');
const { v4: uuidv4 } = require('uuid');
const { validateCombination } = require('../../globals/helpers/meal_combination');
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
exports.save = async (req, res) => {
  try {
    const { dishes, ...data } = validateCombination(req.body);
    const result = await prisma.$transaction(async tx => {
      if (req.params.id) {
        const existing = await tx.mealtype.findUnique({ where: { mealTypesID: req.params.id } });
        if (!existing || existing.meal_kind !== 'combination') fail(404, 'Combination not found');
        if (req.roles !== 'admin' && existing.owner_user_id !== req.userId) fail(403, 'Only the author or an administrator can edit this combination');
      }
      const found = await tx.mealtype.findMany({ where: { mealTypesID: { in: dishes.map(d => d.dish_id) }, meal_kind: 'dish' } });
      if (found.length !== dishes.length) fail(400, 'Only existing individual dishes can be included. Nested combinations are not allowed.');
      const nested = { create: dishes, ...(req.params.id ? { deleteMany: {} } : {}) };
      const payload = { ...data, meal_kind: 'combination', combination_items: nested };
      return req.params.id ? tx.mealtype.update({ where: { mealTypesID: req.params.id }, data: payload, include: { combination_items: true } }) : tx.mealtype.create({ data: { ...payload, mealTypesID: uuidv4(), owner_user_id: req.userId }, include: { combination_items: true } });
    }, { isolationLevel: 'Serializable' });
    return res.status(req.params.id ? 200 : 201).json({ data: result });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    if (['P2002', 'P2034'].includes(error.code)) return res.status(409).json({ message: 'This meal name already exists or was changed. Refresh and try again.' });
    throw error;
  }
};
