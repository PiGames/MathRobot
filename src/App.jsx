import React from 'react';
import {green400} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import Calculator from './Calculator.jsx'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentForward from 'material-ui/svg-icons/content/forward';

const muiTheme = getMuiTheme({
  appBar: {
    height: 50,
  },
  palette: {
    primary1Color: green400
  }
});

const App = () => (
  <div>
    <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
      <div>
        <AppBar className="header" title="Math Robot" showMenuIconButton={false}/>
        <Card>
          <CardHeader title="Calculator input" subtitle="Type your equation, press Enter, and MathRobot will handle the rest. We have full LateX support!" avatar="./calc_card_avatar.jpg"/>
          <CardMedia>
            <Calculator/>
          </CardMedia>
        </Card>
        <Card>
          <CardHeader title="Status log" subtitle="Here you can see how MathRobot's status changed over time." avatar="./prompt_avatar.png"/>
          <CardMedia>
            <List>
            <ListItem leftIcon={<ActionDone/>}>MathRobot is processing your request...</ListItem>
            <ListItem leftIcon={<ActionDone/>}>MathRobot is typing your equation on calculator...</ListItem>
            <ListItem leftIcon={<ActionDone/>}>MathRobot is taking a photo of calculator's display...</ListItem>
            <ListItem leftIcon={<ActionDone/>}>MathRobot is processing an image of calculator's display...</ListItem>
            <Divider/>
            <ListItem leftIcon={<ContentForward/>}>MathRobot is sending result of your equation...</ListItem>
            </List>
          </CardMedia>
        </Card>
      </div>
    </MuiThemeProvider>
  </div>
);

export default App;
