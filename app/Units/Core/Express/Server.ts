import express, { Application } from 'express';

import http from 'http';
import errorhandler from 'errorhandler';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
import { createTerminus } from '@godaddy/terminus';
import { template } from 'lodash';

import Connection from '@/Units/Core/Database/Connection';

import { ApolloServer, ApolloServerExpressConfig, ServerRegistration } from 'apollo-server-express';

import { GraphQLModules } from 'Config/GraphQL';
import { log } from '@/Support/Logs/Logger';

export class Server {
  private readonly _app: Application;

  constructor() {
    // Load express
    this._app = express();
  }

  public get app(): Application {
    return this._app;
  }

  public configure(): Server {
    return this.loadEnvVariables()
      .setDebugMode()
      .configureSequelize()
      .configureExpressServer()
      .configureApolloServer();
  }

  private loadEnvVariables(): Server {
    // Load env variables
    dotenv.config();

    return this;
  }

  private setDebugMode(): Server {
    if (process.env.NODE_ENV === 'development') {
      this._app.use(errorhandler());
    }

    return this;
  }

  private configureSequelize(): Server {
    // prettier-ignore
    new Connection()
      .start()
      .catch((e: any) => {
        log.error(`[Sequelize ERROR] ${e}`);
      });

    return this;
  }

  private configureExpressServer(): Server {
    this._app.use(cookieParser());

    return this;
  }

  private configureApolloServer(): Server {
    const { schema } = GraphQLModules;

    // applly apollo confing to express app
    const apolloConfig: ApolloServerExpressConfig = {
      schema,
      context: async ctx => {
        return { ...ctx };
      },
      formatError: error => {
        log.error(`[Graphql ERROR] ${error}`);
        return error;
      },
    };

    const apolloRegistration: ServerRegistration = {
      app: this._app,
      path: '/graphql',
      cors: true,
      bodyParserConfig: true,
    };

    const apollo = new ApolloServer(apolloConfig);
    apollo.applyMiddleware(apolloRegistration);

    return this;
  }

  static async onSignal(): Promise<any> {
    return;
  }

  static async onShutdown(): Promise<any> {
    log.info('cleanup finished, server is shutting down');
  }

  public start(): Server {
    const HOST = process.env.APP_HOST;
    const PORT = process.env.APP_PORT;
    const APP_URL = template(process.env.APP_URL);

    // create server
    const server = http.createServer(this._app);

    // add terminus cleanup config
    const cleanupOptions = {
      onSignal: Server.onSignal,
      onShutdown: Server.onShutdown,
      timeout: 10000,
      signals: ['SIGINT', 'SIGTERM'],
    };

    createTerminus(server, cleanupOptions);

    // start server
    server.listen(PORT, () => {
      log.info(`Server listening on ${APP_URL({ HOST, PORT })}`);
    });

    return this;
  }
}
