import React from 'react';
import {
  View, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import serverApi from '../utilities/serverApi';

import TabBarIcon from '../assets/TabBarIcon';

import * as profileActions from '../navigation/actions/ProfileActions';
import { setHoldNotification } from '../navigation/actions/RouteActions';

class FooterIcon extends React.Component {
  constructor() {
    super();
    this.state = {
      notification: false,
      timer: null,
    };
  }

  componentDidMount() {
    const { profileState } = this.props;
    const { profileNotification } = profileState;
    const { timer } = this.state;

    clearInterval(timer);
    this.setState({
      notification: profileNotification,
      timer: setInterval(() => {
        this.checkIfNotification();
      }, 60000),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { profileState } = this.props;
    const { profileNotification } = profileState;

    if (profileNotification !== nextProps.profileState.profileNotification) {
      if (profileNotification) {
        this.setState({ notification: false });
      } else {
        this.setState({ notification: true });
      }
    }
  }

  checkIfNotification = () => {
    const {
      setNotifiction, routeState, authState, profileState,
    } = this.props;
    const { holdNotification } = routeState;
    const { jwt } = authState;
    const { profileNotification, profileLoaded } = profileState;
    if (!holdNotification && !profileNotification && profileLoaded) {
      serverApi.post('users/userhasnotifications/', '', 'application/x-www-form-urlencoded', jwt[0])
        .then((responseJson) => {
          const { message } = responseJson;
          if (message) {
            setNotifiction();
          }
        }).catch(error => console.log(error));
    }
  }

  render() {
    const { notification } = this.state;
    const { focused } = this.props;
    return (
      <View key="FooterIcon">
        <TabBarIcon
          focused={focused}
          name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
        />
        {notification ? (
          <View style={{
            position: 'absolute', right: 1, top: 1, backgroundColor: 'red', width: 7, height: 7, borderRadius: 9,
          }}
          />
        ) : null }
      </View>
    );
  }
}

FooterIcon.propTypes = {
  profileState: PropTypes.shape({
    location: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.number.isRequired,
    create_time: PropTypes.string.isRequired,
    game_score: PropTypes.shape({
      bike_score: PropTypes.number.isRequired,
      bikes_lost: PropTypes.number.isRequired,
      thumb_score: PropTypes.number.isRequired,
      total_score: PropTypes.number.isRequired,
    }).isRequired,
    loadingProfile: PropTypes.bool.isRequired,
    profileLoaded: PropTypes.bool.isRequired,
    profileNotification: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
  routeState: PropTypes.shape({
    activeRoute: PropTypes.string.isRequired,
  }).isRequired,
  authState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.array.isRequired,
  }).isRequired,
  setNotifiction: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { profileState, routeState, authState } = state;
  return { profileState, routeState, authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { setHoldNotification, ...profileActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(FooterIcon);
