// Dependency checks and deletion share one transaction. Foreign keys also protect
// meal links created concurrently with this request.
async function deleteUnusedFoodItem(prisma, id) {
  return prisma.$transaction(async tx => {
    const food = await tx.fooditems.findFirst({
      where: { OR: [{ food_itemID: id }, { fooditem_cacheID: id }] },
      include: { local_names: true },
    });
    if (!food) return { status: 404, message: 'Food item not found' };
    const where = { food_item_id: food.food_itemID };
    const counts = await Promise.all([
      tx.meal_food_items.count({ where }),
      tx.meal_type_food_items.count({ where }),
      tx.recipe_food_items.count({ where }),
    ]);
    if (counts.some(Boolean)) return { status: 409, message: 'This food item is used in a meal or recipe and cannot be deleted. Remove those references first.' };
    await tx.fooditemsimages.deleteMany({ where: { foodItems_ID: food.food_itemID } });
    await tx.food_item_countries.deleteMany({ where });
    await tx.food_nutrition.deleteMany({ where });
    await tx.fooditems.delete({ where: { food_itemID: food.food_itemID } });
    return { status: 200, food, message: 'Food item deleted successfully' };
  }, { isolationLevel: 'Serializable' });
}
module.exports = { deleteUnusedFoodItem };
