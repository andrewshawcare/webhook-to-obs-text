import Fastify from "fastify";
import Ngrok from "ngrok"
import { Octokit } from "@octokit/core"
import { writeFile } from "node:fs/promises"
import * as crypto  from "node:crypto";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { isExpectedSignature } from "./is-expected-signature.js";
import { IssuesEvent, issuesEventSchema } from "./model/issues-event.js";
import { WebhookHeaders, webhookHeadersSchema } from "./model/webhook-headers.js";
import { Configuration, configurationSchema } from "./model/configuration.js";
import { constructSchemaValidatedValue } from "./construct-schema-validated-value.js";

const configuration = constructSchemaValidatedValue<Configuration>(
    {
        personalAccessToken: process.env["PERSONAL_ACCESS_TOKEN"],
        owner: process.env["OWNER"],
        repo: process.env["REPO"],
        hookId: parseInt(process.env["HOOK_ID"] || "", 10),
        algorithm: process.env["ALGORITHM"],
        key: crypto.generateKeySync("hmac", { length: 512 }).export().toString("hex"),
        port: parseInt(process.env["PORT"] || "", 10),
        file: process.env["FILE"]
    },
    configurationSchema
);

const url = await Ngrok.connect(configuration.port)

const octokit = new Octokit({ auth: configuration.personalAccessToken });

await octokit.request(`PATCH /repos/{owner}/{repo}/hooks/{hookId}/config`, {
    owner: configuration.owner,
    repo: configuration.repo,
    hookId: configuration.hookId,
    data: JSON.stringify({
        secret: configuration.key,
        url: url
    })
});

const fastify = Fastify({ logger: true });

fastify.post<{
    Body: IssuesEvent,
    Headers: WebhookHeaders
}>("/", {
    schema: {
        body: issuesEventSchema,
        headers: webhookHeadersSchema
    }
}, async (request, reply) => {
    if (
        ! isExpectedSignature({
            actualSignature: request.headers["x-hub-signature-256"],
            algorithm: configuration.algorithm,
            key: configuration.key,
            data: JSON.stringify(request.body)
        })
    ) {
        reply.status(StatusCodes.UNAUTHORIZED);
        throw new Error(ReasonPhrases.UNAUTHORIZED);
    }
    
    const issuesEvent = request.body;
    writeFile(configuration.file, issuesEvent.issue.title);
})

fastify.listen({ host: '127.0.0.1', port: configuration.port })