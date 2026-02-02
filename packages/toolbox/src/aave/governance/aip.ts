/**
 * Collection of tools for aip processing
 */
import yaml from "js-yaml";

/**
 * Simple frontmatter parser using js-yaml
 * Extracts YAML frontmatter from markdown content
 */
export function parseFrontmatterMd(content: string): {
  data: Record<string, any>;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content };
  }

  const [, frontmatter, body] = match;
  const data = yaml.load(frontmatter) as Record<string, any>;

  return { data, content: body };
}

export const Aip = (input: Record<string, unknown>) => {
  if (!input["discussions"] || typeof input["discussions"] !== "string") {
    throw new Error(
      "AIP validation failed: 'discussions' is required and must be a string URL",
    );
  }
  try {
    new URL(input["discussions"]);
  } catch {
    throw new Error("AIP validation failed: 'discussions' must be a valid URL");
  }

  if (!input["title"] || typeof input["title"] !== "string") {
    throw new Error(
      "AIP validation failed: 'title' is required and must be a string",
    );
  }

  if (!input["author"] || typeof input["author"] !== "string") {
    throw new Error(
      "AIP validation failed: 'author' is required and must be a string",
    );
  }

  if (input["snapshot"] && typeof input["snapshot"] !== "string") {
    throw new Error(
      "AIP validation failed: 'snapshot' must be a string URL if provided",
    );
  }

  try {
    if (input["snapshot"]) {
      new URL(input["snapshot"] as string);
    }
  } catch {
    throw new Error("AIP validation failed: 'snapshot' must be a valid URL");
  }

  return input as {
    discussions: string;
    title: string;
    author: string;
    snapshot?: string;
  };
};

export type Aip = ReturnType<typeof Aip>;

/**
 * Validates the aip header and returns some aip metadata
 * @param content
 */
export function validateAip(content: string) {
  const { data, content: body } = parseFrontmatterMd(content);
  const result = Aip(data);

  return {
    ...result,
    body,
  };
}
