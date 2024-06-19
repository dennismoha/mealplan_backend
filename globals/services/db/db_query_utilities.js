const pool = require('../../../config/db');
const DatabaseError = require('../../../middlewares/custom_errors/database_error');
const winstonLogger = require('../../../config/winston_logger');
class IndexQuery {
  async getAll(sql) {
    let Connection;
    try {
      Connection = await pool.getConnection();
      const results = await Connection.execute(sql);
      const result = results[0];
      console.log('results ', result);
      return result;
    } catch (error) {
      throw new DatabaseError('something happened');
    } finally {
      if (Connection) {
        winstonLogger.logger.log('error', 'error returning food');
        Connection.release();
      }
    }
  }

  async checkIfRecordExists(sql, params) {
    let Connection;

    try {
      Connection = await pool.getConnection();
      console.log('params are ', params);
      console.log('sql is ::: ', sql);
      const results = await Connection.execute(sql, [...params]);
      console.log('results are ', results);
      const result = results[0];
      console.log('results ', result);
      return result;
    } catch (error) {
      console.log('error is ', error);
      throw new DatabaseError('something happened');
    } finally {
      if (Connection) {
        Connection.release();
      }
    }
  }

  async insertNewRecord(sql, params) {
    console.log('params are ', [params]);
    console.log('sql is ', sql);
    const results = await pool.execute(sql, [...params]);
    const result = results;
    console.log('results ', result);
    return result;
  }

  async updateRecord(sql, params) {
    console.log('sql is ', sql);
    console.log('params are ', params);
    const results = await pool.execute(sql, [...params]);
    const result = results[0];
    console.log('results ', result);
    return result;
  }
  async deleteRecord(sql, params) {
    console.log('sql is ', sql);
    console.log('params are ', params);
    const results = await pool.execute(sql, [...params]);
    const result = results[0];
    console.log('results ', result);
    return result;
  }
}

module.exports = IndexQuery;
