import { CustomScalar, Scalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";

@Scalar("URL", () => URL)
export class URLScalar implements CustomScalar<string, URL> {
  description = "URL custom scalar type";

  parseValue(value: string): URL {
    return new URL(value);
  }

  serialize(value: URL): string {
    return value.href;
  }

  parseLiteral(ast: ValueNode): URL {
    if (ast.kind === Kind.STRING) {
      return new URL(ast.value);
    }
    return null;
  }
}
