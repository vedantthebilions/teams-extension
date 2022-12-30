import React, { Component } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import * as moment from "moment";
import "../App.css";
import Avatar from "@mui/material/Avatar";
import TimerUI from "../../components/Timer";

class InMeetUI extends Component {
  state = {
    currentTime: "",
  };

  handleCallback = (days, hours, minutes, seconds) => {
    return this.setState({
      currentTime: days + ":" + hours + ":" + minutes + ":" + seconds,
    });
  };

  componentDidMount(){
  }
  // getTimmer = () => {
    
  //   let second = hook.seconds;
  //   let minute = hook.minutes;
  //   let hour = hook.hours;
  //   let day = hook.days;
  //   // this.parentCallback(day, hour, minute, second).then((res) =>
  //   //   console.log(res)
  //   // );
  render() {
    function stringToColor(string) {
      let hash = 0;
      let i;

      /* eslint-disable no-bitwise */
      for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = "#";

      for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
      }
      /* eslint-enable no-bitwise */

      return color;
    }

    function stringAvatar(name) {
      return {
        sx: {
          bgcolor: stringToColor(name),
        },
        children: `${name.charAt(0)}`,
      };
    }

    return (
      //   <MediaQuery maxWidth={280}>
      <div className="main_div">
        <Grid container className="other_div">
          <Grid item xs={6}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <center>
                    <Typography gutterBottom variant="h5" component="div">
                      Meeting Timer
                    </Typography>
                  </center>
                  {/* <Typography variant="body2" color="text.secondary"> */}
                    <TimerUI parentCallback={this.handleCallback} second="1"/>
                  {/* </Typography> */}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
        <strong>Meeting ID :</strong> {this.props.metingDetails?.subject}
        <br />
        <strong>Join Meeting ID: </strong>{" "}
        {this.props.metingDetails?.joinMeetingIdSettings?.joinMeetingId}
        <br />
        <strong>Join Meeting Passcode: </strong>{" "}
        {this.props.metingDetails?.joinMeetingIdSettings?.passcode}
        <br />
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item xs={24}>
            <div>
              <strong>Meeting Start Time: </strong>
              {moment(this.props.metingDetails?.startDateTime).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </div>
            <div>
              <strong>Meeting End Time: </strong>
              {moment(this.props.metingDetails?.endDateTime).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </div>
          </Grid>
          <Grid item xs={12}>
            <strong>Attendees</strong>
          </Grid>
          <Grid item xs={2}>
            {this.props.metingDetails.participants &&
              this.props.metingDetails.participants.attendees.map(function (
                i,
                index
              ) {
                return (
                  <center className="d-flex margin-top-5">
                    <Avatar {...stringAvatar(i.upn)} />{" "}
                    <p className="margin-2">{i.upn}</p>
                  </center>
                );
              })}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default InMeetUI;
