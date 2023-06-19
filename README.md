# webhook-to-obs-text

Use a webhook to update a file that OBS can read as text on stream.

## Getting started

The application presumes you have setup a [GitHub repository webhook](https://docs.github.com/en/rest/webhooks?apiVersion=2022-11-28) already. Here are the initial settings for the webhook:

* Payload URL: Anything you want, this will be replaced when the ngrok tunnel is created.
* Content type: application/json
* SSL verification: Enable SSL verification
* Which events would you like to trigger this webhook?
  * Let me select individual events.
    * Issues
* Active: true

The application also presumes you have a [GitHub fine-grained personal access token](https://github.com/settings/tokens?type=beta) available with the following permissions:

* Repository access: Select an option depending on which repositories you'd like to use.
* Permissions:
  * Repository permissions
    * Webhooks
      * Read and write

The project uses a `.env` file to provide configuration.

Run the following commands to copy the `.env.template` file into a `.env` file you can use.

Ensure you update the `.env` file with the required configuration values.

```shell
cp .env.template .env
nano .env # Fill in your configuration
env $(cat .env) npm start
```

## Architecture

### Sequence diagram

```d2
shape: sequence_diagram

User
GitHub
ngrok
Environment
webhook-to-obs-text
file
OBS

Environment -> webhook-to-obs-text: Provide configuration

webhook-to-obs-text -> ngrok: Establish tunnel
ngrok -> webhook-to-obs-text: Tunnel URL

webhook-to-obs-text -> GitHub: Update webhook with Tunnel URL and key

User -> GitHub: Assign issue

GitHub -> ngrok -> webhook-to-obs-text: Issue assigned event

webhook-to-obs-text -> file: Replace content with assigned issue title

OBS -> file: Update text with content
```

### Schema-driven types

Schemas define the contract between services and the clients that use them over language-agnostic protocols (like HTTPS over the network).

Types define the contract between components of a system written and executed in a common language runtime.

By using tools like [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) to define our contracts using schemas and compiling types from them, we can benefit from language-agnostic schema contracts that can be used as compile-time types within TypeScript.

```d2
Service
Client
Library

Client -> Service: Schema-driven request
Service -> Client: Schema-driven response
Client -> Library: Typed arguments
Library -> Client: Typed return

GitHub
fastify
webhook-to-obs-text

GitHub -> fastify: Issue assigned event
fastify -> fastify: Validate issue assigned event against JSON schema
fastify -> webhook-to-obs-text: Provide request as IssuesEvent type
```