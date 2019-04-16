/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Font, AppLoading, Asset } from 'expo';
import thunk from 'redux-thunk';
import reducers from './navigation/reducers/index';
import AppNavigator from './navigation/AppNavigator';

import { setActiveRoute } from './navigation/actions/RouteActions';

const store = createStore(reducers, applyMiddleware(thunk));
const headerFont = require('./assets/fonts/Noteworthy-Bold.ttf');

const locationIcon = require('./assets/images/location.png');
const thumbUpIcon = require('./assets/images/thumbupNoBack.png');
const thumbDownIcon = require('./assets/images/thumbdownNoBack.png');
const FoundBike = require('./assets/images/FoundBike.png');
const userPlaceholder = require('./assets/images/userPlaceholder.jpg');
const emptyCommentIcon = require('./assets/images/emptyComment.png');
const stockBicycle = require('./assets/images/stockBicycle.png');
const defaultBike = require('./assets/images/bikePlaceholder.png');
const albumImg = require('./assets/images/album.png');
const cameraImg = require('./assets/images/camera.png');
const background = require('./assets/images/background.jpeg');
const profilePic = require('./assets/images/userPlaceholder.jpg');
const bikeIcon = require('./assets/images/biker.png');
const logo = require('./assets/images/biker.png');


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }

  async componentWillMount() {
    await Asset.loadAsync([
      locationIcon,
      thumbUpIcon,
      thumbDownIcon,
      FoundBike,
      userPlaceholder,
      emptyCommentIcon,
      stockBicycle,
      defaultBike,
      cameraImg,
      albumImg,
      background,
      profilePic,
      bikeIcon,
      logo,
    ]);
  }

  async componentDidMount() {
    await Font.loadAsync({
      CustomFont: headerFont,
    });
    this.setState({ isReady: true });
  }

  getCurrentRouteName(navState) {
    if (navState.index) {
      this.getCurrentRouteName(navState.routes[navState.index]);
    } else {
      store.dispatch(setActiveRoute(navState.routeName ? navState.routeName : ''));
    }
  }

  render() {
    const { isReady } = this.state;
    if (!isReady) {
      return <AppLoading />;
    }
    return (
      <Provider store={store}>
        <AppNavigator
          onNavigationStateChange={(prevState, newState) => {
            this.getCurrentRouteName(newState);
          }}
        />
      </Provider>
    );
  }
}
