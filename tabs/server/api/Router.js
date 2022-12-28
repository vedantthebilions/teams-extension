/* import { ClientCredentialRequest, ConfidentialClientApplication, OnBehalfOfRequest } from "@azure/msal-node";
import Axios from "axios";
import { Chat } from "@microsoft/microsoft-graph-types-beta";
import { getItem, setItem } from "node-persist";
import { validateToken } from "./AuthUtils"; */

const ConfidentialClientApplication = require("@azure/msal-node");
const Axios = require("axios");
const validateToken = require("./AuthUtils");
const express = require("express");

const Router = (options) => {
    const router = express.Router();

    router.get(
        "/meetingDetails/:meetingId",
        async (req, res, next) => {
            try {
                res.header("Access-Control-Allow-Origin", "*");

                console.log('req returned');
                
                const token = await validateToken(req);
                console.log(token, 'token');
                
                
                //get OBO (On Behalf Of) token
                try {
                    const cca = new ConfidentialClientApplication({
                        auth: {
                            clientId: 'c73c99e8-6c91-4ffa-9032-4546be30a63c',
                            clientSecret: 'KEe8Q~AwLSjWTOmjs1F1rPoyjpiDJUthY0kRNbNT',
                            authority: 'https://login.microsoftonline.com/6403ff52-7fe4-4f52-8a19-250c9d8736ab/'
                        }
                    });
        
                    console.log('cca=>', cca);
        
                    const response = await cca.acquireTokenOnBehalfOf({
                        oboAssertion: token,
                        scopes: ["OnlineMeetings.Read", "Chat.Read"],
                    });
        
                    console.log('response=>', response);
        
                    // use OBO access token to call MS Graph for Meeting details
                    if (response && response.accessToken) {
                        const authHeader = {
                            Headers: {
                                Authorization: `Bearer ${response.accessToken}`
                            }
                        };
        
                        // get meeting details
                        try {
                            // base64 decode meeting ID & strip surrounding 0# #0
                            const chatId = Buffer.from(meetingId, "base64").toString("ascii").replace(/^0#|#0$/g, "");
                            // get chat details
                            const chat = await Axios.get(`https://graph.microsoft.com/beta/chats/${chatId}`, authHeader);
                            // get meeting details (via chat detail)
                            const onlineMeetings = await Axios.get(`https://graph.microsoft.com/v1.0/me/onlinemeetings?$filter#JoinWebUrl eq "${chat.data.onlineMeetingInfo?.joinWebUrl}"`, authHeader);
        
                            // return first meeting detail returned
                            if (onlineMeetings?.data?.value?.length > 0) {
                                /* res.type("application/json");
                                res.end(JSON.stringify(onlineMeetings?.data?.value[0])); */
                                return JSON.stringify(onlineMeetings?.data?.value[0]);
                            } else {
                                console.error("Bad data returned from online meeting request: ", onlineMeetings);
                                throw new Error("500: Bad data returned from online meeting request");
                            }
                        } catch (err) {
                            throw new Error(`Error getting meeting details: ${err.message}`);
                        }
                    } else {
                        throw new Error("No access token returned");
                    }
                } catch (err) {
                    throw new Error(`OBO token acquire error: ${err.message}`);
                }
            } catch (err) {
                throw new Error(`token validation error: ${err.message}`);
            }
        }
    );
    router.get(
        "/test",
        async (req, res, next) => {
            console.log('here');
            return 'ok';
        });

   return router;
};

module.exports = Router;