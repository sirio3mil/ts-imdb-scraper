import { GraphQLScalarType, Kind, ValueNode } from "graphql";

export const URLScalar = new GraphQLScalarType({
  name: "URL",
  description: "URL custom scalar type",
  serialize: (value: URL) => value.href,
  parseValue: (value: string) => new URL(value),
  parseLiteral: (ast: ValueNode) => {
    if (ast.kind === Kind.STRING) {
      return new URL(ast.value);
    }
    return null;
  }
})
