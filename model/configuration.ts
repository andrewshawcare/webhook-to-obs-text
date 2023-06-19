import { JSONSchema, FromSchema } from "json-schema-to-ts";

const configurationSchema = {
    type: "object",
    additionalProperties: false,
    required: [
        "personalAccessToken",
        "owner",
        "repo",
        "hookId",
        "algorithm",
        "key",
        "port",
        "file"
    ],
    properties: {
        personalAccessToken: { type: "string" },
        owner: { type: "string" },
        repo: { type: "string" },
        hookId: { type: "number" },
        algorithm: { type: "string" },
        key: { type: "string" },
        port: { type: "number", minimum: 1, maximum: 65535 },
        file: { type: "string" }
    }
} as const satisfies JSONSchema
type Configuration = FromSchema<typeof configurationSchema>;

export { configurationSchema, Configuration }