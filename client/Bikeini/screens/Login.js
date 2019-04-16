import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight, Image, KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as authActions from '../navigation/actions/AuthActions';
import * as profileActions from '../navigation/actions/ProfileActions';
import * as jwtActions from '../navigation/actions/JwtActions';
import { headerStyle } from './header';

const logo = require('../assets/images/biker.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    borderBottomColor: '#d8d8d8',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 10,
  },
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
    color: 'white',
  },
  logo: {
    height: 130,
    width: 130,
  },
  logoTextCont: {
    marginTop: 5,
    marginBottom: 20,
  },
  logoText: {
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 14,
  },
});


class Login extends React.Component {
  static navigationOptions = {
    ...headerStyle,
  };

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    const { loadJWTInit } = this.props;
    loadJWTInit();
  }

  componentDidUpdate() {
    const {
      authState, profileState, navigation, loadProfileInit, setIsLoggedIn,
    } = this.props;
    if (
      !authState.loadingJwt
      && authState.jwt[0]
      && !profileState.profileLoaded
      && !profileState.loadingProfile
      && !profileState.error
      && !authState.isLoggedIn
      && !authState.deletingJwt
      && !authState.error) {
      loadProfileInit(authState.jwt[0]);
    } else if (profileState.profileLoaded && profileState.location.length && !authState.isLoggedIn) {
      setIsLoggedIn(true);
      navigation.navigate('Browser');
    } else if (profileState.profileLoaded && !profileState.location.length && !authState.isLoggedIn) {
      setIsLoggedIn(true);
      navigation.navigate('Location');
    }
    return 'did update'; // what to return?
  }

  logInUser = () => {
    const { email, password } = this.state;
    const { loginInit } = this.props;
    loginInit(email, password);
    this.setState({ email: '' });
    this.setState({ password: '' });
  }


  render() {
    const { email, password } = this.state;
    const { navigation, authState, profileState } = this.props;
    if (authState.loadingJwt || profileState.loadingProfile || authState.authorizing) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Image style={styles.logo} source={logo} />
        <View style={styles.logoTextCont}>
          <Text style={styles.logoText}> Cykelinspektionen </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            value={email}
            onChangeText={text => this.setState({ email: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry
            underlineColorAndroid="transparent"
            value={password}
            onChangeText={text => this.setState({ password: text })}
          />
        </View>
        <Text style={{ color: 'red' }}>
          { authState.error ? authState.error : ''}
        </Text>

        <TouchableHighlight style={[styles.buttonContainer, styles.greenButton]} onPress={this.logInUser}>
          <Text style={styles.greenButtonText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.buttonContainer, styles.greenButton]} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.greenButtonText}>Sign up</Text>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.buttonContainer, styles.greenButton]} onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.greenButtonText}>Reset password</Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  authState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.array.isRequired,
  }).isRequired,
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
    error: PropTypes.string.isRequired,
  }).isRequired,
  loadJWTInit: PropTypes.func.isRequired,
  loadProfileInit: PropTypes.func.isRequired,
  loginInit: PropTypes.func.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...authActions, ...profileActions, ...jwtActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
