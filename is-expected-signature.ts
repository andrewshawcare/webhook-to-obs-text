import * as crypto from "node:crypto";

const isExpectedSignature = ({
    actualSignature,
    algorithm,
    key,
    data
}: {
    actualSignature: string,
    algorithm: string,
    key: crypto.BinaryLike | crypto.KeyObject,
    data: crypto.BinaryLike
}) => {
    const digest = crypto.createHmac(algorithm, key)
        .update(data)
        .digest("hex");
    
    const expectedSignature = `${algorithm}=${digest}`;

    return actualSignature === expectedSignature;
}

export { isExpectedSignature };