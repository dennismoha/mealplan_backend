// This contains logic meal type.
// Examples of meal type is ugali, githeri etc

const IndexQuery = require('../query_utiltity/index');

// fetch all fetchMealTypes.
exports.fetchMealTypes = async (req, res) => {
  let sql = 'SELECT * FROM meal_plan.mealtype';
  let mealTypeResults, mealTypeInstance;

  try {
    mealTypeInstance = new IndexQuery();
    mealTypeResults = await mealTypeInstance.getAll(sql);
    console.log('items are ', mealTypeResults);
    return res.status(200).json(mealTypeResults);
  } catch (error) {
    console.log('error ftching mealTypes');
    return res.status(400).send(`error fetching mealTypes ${error}`);
  }
};

// creating a new meal type record

exports.createNewMealType = async (req, res) => {
  let mealType,
    checkmealTypeExistsSql,
    checkmealTypeExistsSqlClass,
    checkmealTypeExistsSqlResults,
    insertMealTypeSql,
    insertMealType;
  console.log('meal type req.body ', req.body);
  mealType = req.body.mealName;
  //checkmealTypeExistsSql = 'SELECT meal_name FROM mealtype where LOWER(meal_name) = LOWER(?)';
  checkmealTypeExistsSql = 'SELECT meal_name FROM mealtype WHERE LOWER(meal_name) LIKE LOWER(?)';
  insertMealTypeSql = 'INSERT INTO `meal_plan`.`mealtype` (`meal_name`) VALUES (?)';

  try {
    // first of all check if a record exists with that unit name
    checkmealTypeExistsSqlClass = new IndexQuery();
    checkmealTypeExistsSqlResults = await checkmealTypeExistsSqlClass.checkIfRecordExists(checkmealTypeExistsSql, [
      '%' + mealType + '%',
    ]);
    // checkmealTypeExistsSqlResults = await checkmealTypeExistsSqlClass.checkIfRecordExists(
    //   checkmealTypeExistsSql,
    //   mealType,
    // );

    // if it exists return an error that, That unit exists
    if (checkmealTypeExistsSqlResults.length > 0) {
      return res.status(400).json({ message: 'meal exists' });
    }

    // If not create a new record
    insertMealType = await checkmealTypeExistsSqlClass.insertNewRecord(insertMealTypeSql, [mealType]);
    console.log('insert mealtype results', insertMealType);
    console.log('unit exists sql class', checkmealTypeExistsSqlResults);

    return res.status(201).json({ message: 'succesfully added a meal' });
  } catch (error) {
    return res.status(400).send(`error creating meal ${error}`);
  }
};
exports.saveEditMealType = async (req, res) => {
  let mealType,
    checkmealTypeExistsSql,
    checkmealTypeExistsSqlClass,
    checkmealTypeExistsSqlResults,
    insertMealTypeSql,
    insertMealType,
    mealTypesID;
  console.log('update req.body ', req.body);
  mealType = req.body.meal_name;
  mealTypesID = req.params.id;
  checkmealTypeExistsSql = 'SELECT meal_name FROM mealtype where LOWER(meal_name) = LOWER(?)';
  insertMealTypeSql = 'UPDATE `meal_plan`.`mealtype` SET `meal_name` = ? WHERE (`mealTypesID` = ?);';

  try {
    // first of all check if a record exists with that meal name
    console.log('params for the meal Typed id are :', req.params);
    checkmealTypeExistsSqlClass = new IndexQuery();
    checkmealTypeExistsSqlResults = await checkmealTypeExistsSqlClass.checkIfRecordExists(checkmealTypeExistsSql, [
      mealType,
    ]);

    console.log('editing meals');
    // if it exists return an error that meal exists
    if (checkmealTypeExistsSqlResults.length > 0) {
      return res.status(400).json({ message: 'meal exists' });
    }
    console.log('saving meals ', mealTypesID);
    // If not create a new record
    insertMealType = await checkmealTypeExistsSqlClass.insertNewRecord(insertMealTypeSql, [mealType, mealTypesID]);
    console.log('insert mealtype results', insertMealType);
    console.log('unit exists sql class', checkmealTypeExistsSqlResults);

    return res.status(201).json({ message: 'succesfully edited the  meal' });
  } catch (error) {
    return res.status(400).send(`error creating meal ${error}`);
  }
};

// DELETE
exports.deleteMealType = async (req, res) => {
  try {
    const mealTypesID = req.params.id;
    console.log('meal types id for delete is ', req.params);
    let mealTypeInstanceClass = new IndexQuery();

    const deleteRecordSQL = 'DELETE FROM MealType WHERE mealTypesID = ?';

    await mealTypeInstanceClass.updateRecord(deleteRecordSQL, [mealTypesID]);
    res.status(200).json({ message: 'Meal Type deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
