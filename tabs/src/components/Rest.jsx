import React, { Component } from "react";
import { app } from "@microsoft/teams-js";
import Axios from "axios";
import * as Msal from "msal";
import Box from "@mui/material/Box";
import PreMeetUI from "./MeetingUIComponent/PreMeetUI";
import InMeetUI from "./MeetingUIComponent/InMeetUI";

class Rest extends Component {
  state = {
    accessToken: "",
    meetingId: "",
    meetingDetails: "",
    meetingContext: "",
    chatId: "",
  };

  componentDidMount() {
    app.initialize().then(() => {
      // get AuthToken
      this.getAuthToken();
      // Get the user context from Teams and set it in the state
      app.getContext().then((context) => {
        this.setState({
          meetingContext: context,
          meetingId: context.meeting.id,
          chatId: context.chat.id,
        });
        this.getMeetingDetails();
      });
    });
    }

  getMeetingDetails = async () => {
    if (this.state.chatId && this.state.accessToken) {
      const authHeader = {
        headers: {
          Authorization: `Bearer ${this.state.accessToken}`,
        },
      };
      await Axios.get(
        `https://graph.microsoft.com/beta/chats/${this.state.chatId}`,
        authHeader
      ).then(async (chat) => {
        await Axios.get(
          `https://graph.microsoft.com/v1.0/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'${chat.data.onlineMeetingInfo?.joinWebUrl}'`,
          authHeader
        ).then((res) => {
          this.setState({
            meetingDetails: res.data?.value[0],
          });
        });
      });
    }
  };

  getAuthToken = () => {
    const msalConfig = {
      auth: {
        clientId: "27b4c3f0-58a6-41ea-8cd8-672448a5960e",
      },
    };
    const msalInstance = new Msal.UserAgentApplication(msalConfig);
    if (msalInstance.getAccount()) {
      var tokenRequest = {
        scopes: ["user.read", "mail.send"],
      };
      msalInstance
        .acquireTokenSilent(tokenRequest)
        .then((response) => {
          // get access token from response
          // response.accessToken
          this.setState({
            accessToken: response.accessToken,
          });
        })
        .catch((err) => {
          // could also check if err instance of InteractionRequiredAuthError if you can import the class.
          if (err.name === "InteractionRequiredAuthError") {
            return msalInstance
              .acquireTokenPopup(tokenRequest)
              .then((response) => {
                // get access token from response
                // response.accessToken
                this.getAuthToken();
              })
              .catch((err) => {
                // handle error
              });
          } else {
          }
        });
    } else {
      var loginRequest = {
        scopes: ["user.read", "mail.send"], // optional Array<string>
      };
      // user is not logged in, you will need to log them in to acquire a token
      msalInstance
        .loginPopup(loginRequest)
        .then((response) => {
          // handle response
          console.log("response loginPopup", response);
          this.getAuthToken();
        })
        .catch((err) => {
          // handle error
          console.log("err loginPopup", err);
        });
    }
  };

  render() {
    console.log("this.state.meetingDetails", this.state.meetingDetails);
    return (
      <Box sx={{ width: "100%" }}>
        {this.state.meetingContext?.page?.frameContext === "content" ? (
          <PreMeetUI metingDetails={this.state.meetingDetails} />
        ) : (
          <InMeetUI metingDetails={this.state.meetingDetails} />
        )}
      </Box>
    );
  }
}

export default Rest;
