// import * as jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const getSigningKeys = (header, callback) => {
    const client = jwksClient({
        jwksUrl: "https://login.microsoftonline.com/common/discovery/keys"
    });

    client.getSigningKeys(header.kid, function(err, key) {
        callback(err, key.publicKey || key.rsaPublicKey);
    });
};

async function validateToken(req) {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers.authorization;

         if (authHeader) {
            const token = authHeader.split(" ").pop();
            
            if (token) {
                const validationOption = {
                    //audience: `api://${process.env.PUBLIC_HOSTNAME}/${process.env.MICROSOFT_APP_ID}`
                    // audience: `api://localhost:53000/c73c99e8-6c91-4ffa-9032-4546be30a63c`
                    audience: `api://bilionsfirstexpressapp.azurewebsites.net/27b4c3f0-58a6-41ea-8cd8-672448a5960e`
                };

                jwt.verify(token, getSigningKeys, validationOption, (err, payload) => {
                    if (err) { reject(new Error("403")); }
                    resolve(token);
                });
            } else {
                reject(new Error("401"));
            }
        } else {
            reject(new Error("401"));
        }
    });
}
module.exports = validateToken;