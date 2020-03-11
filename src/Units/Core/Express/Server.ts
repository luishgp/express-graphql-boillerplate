import express, { Application } from 'express';

import http from 'http';
import errorhandler from 'errorhandler';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
import { createTerminus } from '@godaddy/terminus';
import { template } from 'lodash';

import { ApolloServer, ApolloServerExpressConfig, ServerRegistration } from 'apollo-server-express';

import { allSchema } from '@/graphql/schema';
import { logger } from '@/appbase/logger';

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

  private configureExpressServer(): Server {
    this._app.use(cookieParser());

    return this;
  }

  private configureApolloServer(): Server {
    // applly apollo confing to express app
    const apolloConfig: ApolloServerExpressConfig = {
      schema: allSchema,
      context: async ctx => {
        return { ...ctx };
      },
      formatError: error => {
        logger.error(`[Graphql ERROR] ${error}`);
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

  private static async onSignal(): Promise<any> {
    return;
  }

  private static async onShutdown(): Promise<any> {
    logger.info('cleanup finished, server is shutting down');
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
      logger.info(`Server listening on ${APP_URL({ HOST, PORT })}`);
    });

    return this;
  }
}
