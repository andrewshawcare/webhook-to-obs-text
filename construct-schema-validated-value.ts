import Ajv, { Schema } from "ajv";

const constructSchemaValidatedValue = <Value>(
    value: { [Key in keyof Value]: Value[Key] | undefined },
    schema: Schema
): Value => {
    const ajv = new Ajv.default({ strict: true });
    const validate = ajv.compile<Value>(schema);

    if (validate(value)) {
        return value;
    } else {
        throw new Error(JSON.stringify(validate.errors))
    }
}

export { constructSchemaValidatedValue }