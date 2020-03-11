import { Sequelize, SequelizeOptions as DatabaseConfig } from 'sequelize-typescript';
import { get } from 'lodash';
import { join, basename } from 'path';
import Umzug, { Migration as MigrationInterface } from 'umzug';

import Glob from 'glob';

import Config from 'Config/Database';

export default class Connection {
  public connection: Sequelize;

  constructor() {
    this.connection = this.getConnection();
  }

  private getConnection(): Sequelize {
    const type = process.env.DB_CONNECTION || '';
    const config: DatabaseConfig = get(Config, type);

    const { dialect, database, host, username, password, storage, ...rest } = config;

    const models = [join(__dirname, '{dist,app}/Domains/**/Models/*.ts')];

    if (dialect === 'sqlite') {
      return new Sequelize({
        dialect,
        storage,
        models, // Glob dynamically load models
      });
    }

    if (!database || !username || !password) {
      throw 'Database connection error';
    }

    return new Sequelize(database, username, password, {
      host,
      dialect,
      ...rest,
      models,
    });
  }
  //
  // migrationsList(migrations, params = []) {
  //   const tmp = migrations.map(({ up, down, name }) => ({
  //     file: name,
  //     testFileName: function(needle) {
  //       return this.file.indexOf(needle) === 0;
  //     },
  //     up,
  //     down,
  //   }));
  //   tmp.params = params;
  //   return tmp;
  // }

  async getMigrations() {
    return await Promise.all(
      Glob.sync(join(process.cwd(), './{app,dist}/**/Migrations/*.ts')).map(async (path: string) => {
        const {
          Migration: { up, down },
        } = await import(path);
        const name = basename(path);
        return {
          file: name,
          testFileName: function(needle: string): boolean {
            return name.indexOf(needle) === 0;
          },
          up,
          down,
        };
      }),
    );
  }

  async runMigrations() {
    const migrations: any = await this.getMigrations();

    const umzug = new Umzug({
      migrations,
      storage: 'sequelize',
      storageOptions: {
        sequelize: this.connection,
      },
    });

    await umzug.up();
    console.log('All migrations performed successfully');
  }

  async start() {
    await this.connection.authenticate();
    await this.runMigrations();
  }
}
