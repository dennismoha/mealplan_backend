const prisma = require('../../models/prisma');
exports.save = async (req, res) => {
  const id = req.params.id;
  if (!await prisma.fooditems.findUnique({ where: { food_itemID: id } })) return res.status(404).json({ message: 'Food item not found' });
  const data = { updated_at: new Date() };
  for (const key of ['serving_size_g','energy_kcal','protein_g','carbohydrates_g','fat_g','fiber_g','price_per_100g']) {
    const value = req.body[key];
    if (value === undefined) continue;
    if (value === null || value === '') { data[key] = null; continue; }
    if (typeof value !== 'number' || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 999999 || (key === 'serving_size_g' && Number(value) === 0)) return res.status(400).json({ message: `Invalid ${key}` });
    data[key] = Number(value);
  }
  if (req.body.currency !== undefined) { if (typeof req.body.currency !== 'string' || !/^[A-Z]{3}$/.test(req.body.currency)) return res.status(400).json({ message: 'Use a three-letter currency code' }); data.currency = req.body.currency; }
  if (req.body.source !== undefined) { if (typeof req.body.source !== 'string' || req.body.source.length > 255) return res.status(400).json({ message: 'Source must be at most 255 characters' }); data.source = req.body.source || null; }
  for (const [key, max] of [['price_source', 255], ['price_location', 150]]) {
    if (req.body[key] === undefined) continue;
    if (typeof req.body[key] !== 'string' || req.body[key].length > max) return res.status(400).json({ message: `Invalid ${key}` });
    data[key] = req.body[key].trim() || null;
  }
  if (req.body.price_checked_at !== undefined) {
    const value = req.body.price_checked_at;
    if (value === null || value === '') data.price_checked_at = null;
    else {
      const date = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(NaN);
      if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value || value > new Date().toISOString().slice(0, 10)) return res.status(400).json({ message: 'Choose a valid price check date, today or earlier' });
      data.price_checked_at = date;
    }
  }
  if (data.price_per_100g != null && (!data.price_checked_at || !data.price_source || !data.price_location)) return res.status(400).json({ message: 'Record the price check date, source and location with the price' });
  res.json({ data: await prisma.food_nutrition.upsert({ where: { food_item_id: id }, create: { ...data, food_item_id: id }, update: data }) });
};
