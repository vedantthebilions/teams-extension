import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import * as moment from "moment";
import Avatar from "@mui/material/Avatar";
import Paper  from "@mui/material/Paper";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Item = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const Chip = styled(Paper)(({ theme }) => ({
    boxShadow: 'none',
    backgroundColor: "transparent",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Meeting Details" {...a11yProps(0)} />
          <Tab label="Meeting attendees" {...a11yProps(1)} />
          {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item xs={12}>
            <Item>
              <strong>{props.metingDetails?.subject}</strong>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <strong>Meeting Start Time</strong>
              <br />{" "}
              {moment(props.metingDetails?.startDateTime).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <strong>Meeting End Time</strong>
              <br />
              {moment(props.metingDetails?.endDateTime).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <strong>Join Meeting ID</strong>
              <br /> {props.metingDetails?.joinMeetingIdSettings?.joinMeetingId}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <strong>Join Meeting Passcode</strong>
              <br /> {props.metingDetails?.joinMeetingIdSettings?.passcode}
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item style={{ textAlign: "center" }}>
              <a
                href={props.metingDetails?.joinWebUrl}
                style={{ cursor: "default" }}
                value={props.metingDetails?.joinWebUrl}
              >
                Join from web
              </a>
            </Item>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            {/* <Item>
            <strong>Meeting Organiz</strong>
              <br />
              {props.metingDetails?.participants?.organizer.upn}
            </Item> */}
          </Grid>
          {props.metingDetails.participants &&
            props.metingDetails.participants.attendees.map(function (i, index) {
              return (
                <>
                  <Grid item xs={6}>
                    <Chip>
                      <center>
                        <Avatar {...stringAvatar(i.upn)} />{" "}
                      </center>
                      <br />
                      {i.upn}
                    </Chip>
                  </Grid>
                  <Grid item xs={6}>
                    <Chip>
                      <center>
                        <Avatar {...stringAvatar(i.upn)} />{" "}
                      </center>
                      <br />
                      {i.upn}
                    </Chip>
                  </Grid>
                </>
              );
            })}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}
