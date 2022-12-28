import React from "react";
import { useState, useEffect } from "react";
import { app } from "@microsoft/teams-js";
import MediaQuery from 'react-responsive';
import './App.css';
import Rest from "./Rest";

function Tab(props) {
  const [meetingId, setMeetingId] = useState('');
  const [userPrincipleName, setUserPrincipleName] = useState('');

  useEffect(() => {
    app.initialize().then(() => {
      // Get the user context from Teams and set it in the state
      app.getContext().then(async (context) => {
        setMeetingId(context.meeting.id);
        setUserPrincipleName(context.user.userPrincipalName);
      });
    });
    // Next steps: Error handling using the error object
  }, [])
  
  

  return (
  <div>
    <h1>In-meeting app sample</h1>
    <h3>Principle Name:</h3>
    <p>{userPrincipleName}</p>
    <h3>Meeting ID:</h3>
    <p>{meetingId}</p>
    <MediaQuery maxWidth={280}>
      <h3>This is the side panel</h3>
      <a href="https://docs.microsoft.com/en-us/microsoftteams/platform/apps-in-teams-meetings/teams-apps-in-meetings">Need more info, open this document in new tab or window.</a>
    </MediaQuery>
    <Rest />
  </div>
  );
}

export default Tab;