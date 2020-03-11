import { GraphQLModule } from '@graphql-modules/core';
import { TodoModule } from '@/Domains/Todo/GraphQL/Schemas/TodoModule';

export const GraphQLModules = new GraphQLModule({
  imports: [TodoModule],
});
