import React from 'react';
import { useState, useEffect } from "react";
import { app, authentication, FrameContexts } from "@microsoft/teams-js";
import Axios from "axios";
import jwtDecode from "jwt-decode";
import { ClientCredentialRequest, ConfidentialClientApplication, OnBehalfOfRequest } from "@azure/msal-node";
import { InitTeamsFx } from "../sso/InitTeamsFx";
import * as Msal from "msal";

const msalConfig = {
    auth: {
        clientId: '27b4c3f0-58a6-41ea-8cd8-672448a5960e'
    }
};

var loginRequest = {
    scopes: ["user.read", "mail.send"] // optional Array<string>
};


const Rest = (props) => {
    // const [{ inTeams, context }] = useTeams();
    /* const [{ inTeams, context }] = useTeams({}); */
    const [accessToken, setAccessToken] = useState('');
    const [meetingId, setMeetingId] = useState('');
    const [chatId, setChatId] = useState('');
    const msalInstance = new Msal.UserAgentApplication(msalConfig);

    useEffect(() => {
        app.initialize().then(() => {
            console.log('initialize called');

            
            // get AuthToken
            getAuthToken();
            

            // Get the user context from Teams and set it in the state
            app.getContext().then(async (context) => {
                // console.log('context', context);
              setMeetingId(context.meeting.id);
              setChatId(context.chat.id);
            });
            
            // authentication.getAuthToken({
            //     // resources: "api://localhost:53000/c73c99e8-6c91-4ffa-9032-4546be30a63c",  // /inTeamsSSO=True
            //     resources: "api://localhost:53000/27b4c3f0-58a6-41ea-8cd8-672448a5960e", 
            //     // resources: "api://bilionsfirstexpressapp.azurewebsites.net/27b4c3f0-58a6-41ea-8cd8-672448a5960e",
            //     // silent: false,
            //     scopes: ["OnlineMeetings.Read", "Chat.Read", "User.Read", "Mail.Read", "MailboxSettings.Read", "OnlineMeetingArtifact.Read.All", "OnlineMeetingRecording.Read.All", "OnlineMeetings.Read", "OnlineMeetings.ReadWrite"]
            // }).then(token => {
            //     console.log(token, 'token');
            //     //const decoded = jwtDecode(token);
            //     /* setName(decoded?.name);
            //     setCurrentUserId(decoded.oid);
            //     setCurrentUserName(decoded?.name); */
            //     setAccessToken(token);
            //     app.notifySuccess();
            // }).catch(message => {
            //     console.log(message, 'message');
            //     //setError(message);
            //     app.notifyFailure({
            //         reason: app.FailedReason.AuthFailed,
            //         message
            //     });
            // });

          });
       
    }, []);

    useEffect(() => {
        (async () => {
            if (chatId && accessToken) {
                const authHeader = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        // Authorization: `Bearer REPLACE_ACCESS_TOKEN_HERE`,
                        // AccessControlAllowHeaders: '*',
                        // AccessControlAllowHeaders: 'Origin, X-Requested-With, Content-Type,  Accept, x-client-key, x-client-token, x-client-secret, Authorization',
                        // AccessControlAllowOrigin: '*',
                    }
                };

                const chat = await Axios.get(`https://graph.microsoft.com/beta/chats/${chatId}`, authHeader);
                //const meetingDetailsResponse = await Axios.get(`https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'https://teams.microsoft.com/l/meetup-join/19%3ameeting_YTljMjcwYjctMzliZC00OWQwLTg3ZjMtZjI1ZTU0MTY0ZTcw%40thread.v2/0?context=%7b%22Tid%22%3a%228d6cd862-aca1-490d-9dde-c5aa72052b0b%22%2c%22Oid%22%3a%222a730820-c6ce-418d-b4fc-4340fe6506f5%22%7d'`, authHeader);
                const meetingDetailsResponse = await Axios.get(`https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'${chat.data.onlineMeetingInfo?.joinWebUrl}'`, authHeader);
                // get meeting deatils
                // const meetingDetailsResponse = await Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/demo/meetingDetails/${meetingId}`, authHeader);
                // const meetingDetailsResponse = await Axios.get(`https://4875-120-138-4-223.in.ngrok.io/api/demo/meetingDetails/${meetingId}`, authHeader);
                //const meetingDetailsResponse = await Axios.get(`http://localhost:3007/api/demo/meetingDetails/${meetingId}`, authHeader);
                //const meetingDetailsResponse = await Axios.get(`https://bilionsfirstexpressapp.azurewebsites.net/meetingDetails/${chatId}`, authHeader);
                //const meetingDetailsResponse = await Axios.get(`https://bilionsfirstexpressapp.azurewebsites.net/user/2a730820-c6ce-418d-b4fc-4340fe6506f5`, authHeader);
                // const meetingDetailsResponse = await Axios.get(`https://bilionsfirstexpressapp.azurewebsites.net/me`, authHeader);
                //const meetingDetailsResponse = await Axios.get(`https://graph.microsoft.com/v1.0/communications/calls/${meetingId}`, authHeader);
                // const meetingDetailsResponse = await getMeetingDeatils(meetingId);
                console.log(meetingDetailsResponse, 'test');

            }
        })();
    }, [chatId, accessToken]);

    const getAuthToken = () => {
        console.log('called no');
        if (msalInstance.getAccount()) {
            console.log('getAccount');
            var tokenRequest = {
                scopes: ["user.read", "mail.send"]
            };
            msalInstance.acquireTokenSilent(tokenRequest)
                .then(response => {
                    // get access token from response
                    // response.accessToken
                    console.log('response acquireTokenSilent', response);
                    setAccessToken(response.accessToken);
                })
                .catch(err => {
                    // could also check if err instance of InteractionRequiredAuthError if you can import the class.
                    if (err.name === "InteractionRequiredAuthError") {
                        return msalInstance.acquireTokenPopup(tokenRequest)
                            .then(response => {
                                // get access token from response
                                // response.accessToken
                                console.log('response acquireTokenPopup', response);
                                getAuthToken();
                            })
                            .catch(err => {
                                // handle error
                                console.log('err acquireTokenPopup', err);
                            });
                    } else {
                        console.log('else');
                    }
                });
        } else {
            // user is not logged in, you will need to log them in to acquire a token
            msalInstance.loginPopup(loginRequest)
                .then(response => {
                    // handle response
                    console.log('response loginPopup', response);
                    getAuthToken();
                })
                .catch(err => {
                    // handle error
                    console.log('err loginPopup', err);
                });
        }
    }

    

    // const getMeetingDeatils = async (meetingId) => {
    //     // const token = await validateToken(accessToken);
    //     const token = accessToken;
    //     // get OBO (On Behalf Of) token
    //     try {
    //         const cca = new ConfidentialClientApplication({
    //             auth: {
    //                 clientId: 'c73c99e8-6c91-4ffa-9032-4546be30a63c',
    //                 clientSecret: 'KEe8Q~AwLSjWTOmjs1F1rPoyjpiDJUthY0kRNbNT',
    //                 authority: 'https://login.microsoftonline.com/6403ff52-7fe4-4f52-8a19-250c9d8736ab/'
    //             }
    //         });

    //         console.log('cca=>', cca);

    //         const response = await cca.acquireTokenOnBehalfOf({
    //             oboAssertion: token,
    //             scopes: ["OnlineMeetings.Read", "Chat.Read"],
    //         });

    //         console.log('response=>', response);

    //         // use OBO access token to call MS Graph for Meeting details
    //         if (response && response.accessToken) {
    //             const authHeader = {
    //                 Headers: {
    //                     Authorization: `Bearer ${response.accessToken}`
    //                 }
    //             };

    //             // get meeting details
    //             try {
    //                 // base64 decode meeting ID & strip surrounding 0# #0
    //                 const chatId = Buffer.from(meetingId, "base64").toString("ascii").replace(/^0#|#0$/g, "");
    //                 // get chat details
    //                 const chat = await Axios.get(`https://graph.microsoft.com/beta/chats/${chatId}`, authHeader);
    //                 // get meeting details (via chat detail)
    //                 const onlineMeetings = await Axios.get(`https://graph.microsoft.com/v1.0/me/onlinemeetings?$filter#JoinWebUrl eq "${chat.data.onlineMeetingInfo?.joinWebUrl}"`, authHeader);

    //                 // return first meeting detail returned
    //                 if (onlineMeetings?.data?.value?.length > 0) {
    //                     /* res.type("application/json");
    //                     res.end(JSON.stringify(onlineMeetings?.data?.value[0])); */
    //                     return JSON.stringify(onlineMeetings?.data?.value[0]);
    //                 } else {
    //                     console.error("Bad data returned from online meeting request: ", onlineMeetings);
    //                     throw new Error("500: Bad data returned from online meeting request");
    //                 }
    //             } catch (err) {
    //                 throw new Error(`Error getting meeting details: ${err.message}`);
    //             }
    //         } else {
    //             throw new Error("No access token returned");
    //         }
    //     } catch (err) {
    //         throw new Error(`OBO token acquire error: ${err.message}`);
    //     }
    // }

    return (
        <div>
            <h1>meetingId: {meetingId}</h1>
            <h1>accessToken: {accessToken}</h1>
            <h1>New Request </h1>
            
        </div>
    );
}

export default Rest;