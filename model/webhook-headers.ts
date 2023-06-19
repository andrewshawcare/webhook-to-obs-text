import { FromSchema, JSONSchema } from "json-schema-to-ts";

const webhookHeadersSchema = {
    type: "object",
    required: [
        "x-github-event",
        "x-hub-signature-256"
    ],
    properties: {
        "x-github-event": {
            type: "string",
            enum: ["issues"]
        },
        "x-hub-signature-256": {
            type: "string"
        }
    }
} as const satisfies JSONSchema;
type WebhookHeaders = FromSchema<typeof webhookHeadersSchema>;

export { WebhookHeaders, webhookHeadersSchema }