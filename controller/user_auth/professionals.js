const prisma = require('../../models/prisma');
const { profileData, profileView } = require('../../globals/helpers/professional_profile');
const MealPlanDB = require('../../globals/services/db/meal_plan_db');
const visible = { role: 'professional', OR: [{ userscol: null }, { userscol: 'active' }], mealplantime: { some: {} } };
// Explicit selection keeps authentication fields and email out of public responses.
const select = { idusers: true, first_name: true, last_name: true, jobs: true, bio: true, image_url: true };
exports.list = async (req, res) => {
  const users = await prisma.users.findMany({ where: visible, select: { ...select, _count: { select: { mealplantime: true } } }, orderBy: [{ first_name: 'asc' }, { idusers: 'asc' }] });
  res.json({ professionals: users.map(user => ({ ...profileView(user), plan_count: user._count.mealplantime })) });
};
exports.detail = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ message: 'Invalid professional ID' });
  const user = await prisma.users.findFirst({ where: { ...visible, idusers: id }, select });
  if (!user) return res.status(404).json({ message: 'Professional not found' });
  res.json({ professional: profileView(user), plans: await new MealPlanDB().fetchMealPlansForOwner(id) });
};
exports.saveOwn = async (req, res) => {
  const data = profileData(req.body, true);
  const user = await prisma.users.update({ where: { idusers: Number(req.userId) }, data });
  res.json({ professional: profileView(user) });
};
exports.own = async (req, res) => {
  const user = await prisma.users.findUnique({ where: { idusers: Number(req.userId) }, select });
  res.json({ professional: profileView(user) });
};
