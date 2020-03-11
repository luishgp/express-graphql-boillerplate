import { Sequelize, Options as DatabaseConfig } from 'sequelize';
import { get } from 'lodash';

import Config from 'Config/Database';

export default class Connection {
  private connection: Sequelize;

  constructor() {
    this.connection = Connection.getConnection();
  }

  static getConnection(): Sequelize {
    const type = process.env.DB_CONNECTION || '';
    const config: DatabaseConfig = get(Config, type);

    const { dialect, database, host, username, password, storage, ...rest } = config;

    if (dialect === 'sqlite') {
      return new Sequelize({
        dialect,
        storage,
      });
    }

    if (!database || !username || !password) {
      throw 'Database connection error';
    }

    return new Sequelize(database, username, password, {
      host,
      dialect,
      ...rest,
    });
  }

  async authenticate() {
    return this.connection.authenticate();
  }

  async sync() {
    return this.connection.sync();
  }

  static async start() {
    const connection = Connection.getConnection();

    await connection.authenticate();
    await connection.sync();
  }
}
