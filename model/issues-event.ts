import { FromSchema, JSONSchema } from "json-schema-to-ts";

const issuesEventSchema = {
    type: "object",
    required: ["action", "issue"],
    properties: {
        action: {
            type: "string",
            enum: ["assigned"]
        },
        issue: {
            type: "object",
            required: ["title"],
            properties: {
                title: {
                    type: "string"
                }
            }
        }
    }
} as const satisfies JSONSchema;
type IssuesEvent = FromSchema<typeof issuesEventSchema>;

export { IssuesEvent, issuesEventSchema }