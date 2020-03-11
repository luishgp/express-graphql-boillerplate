import { GraphQLModule } from '@graphql-modules/core';

import TodoResolver from '@/Domains/Todo/GraphQL/Resolvers/TodoResolver';
import TodoTypes from '@/Domains/Todo/GraphQL/Types/TodoTypes';

export const TodoModule = new GraphQLModule({
  typeDefs: TodoTypes,
  resolvers: TodoResolver,
});
