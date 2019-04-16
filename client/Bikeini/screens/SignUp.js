import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as authActions from '../navigation/actions/AuthActions';
import serverApi from '../utilities/serverApi';
import * as profileActions from '../navigation/actions/ProfileActions';
import * as jwtActions from '../navigation/actions/JwtActions';
import { headerBackStyle } from './header';

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
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 35,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 35,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputsError: {
    color: 'red',
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
  loginButton: {
    marginTop: 35,
    backgroundColor: '#44ccad',
  },
  loginText: {
    color: 'white',
  },
  logo: {
    height: 130,
    width: 130,
  },
  logoTextCont: {
    marginTop: 5,
  },
  logoText: {
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 14,
  },
});

const passLowCase = 'abcdefghijklmnopqrstuvwxyz';
const passUpCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const passNumbs = '1234567890';
const passChars = ' !"#$%&()*+,-./:;<=>?@[\]^_`{|}~';

class SignUp extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      newUsername: '',
      newEmail: '',
      newPhoneNumber: 0,
      newPassword: '',
      newPasswordConfirm: '',
      clicked: false,
      credStatus: {},
    };
  }

  createNewUser = () => {
    const {
      newUsername, newEmail, newPhoneNumber, newPassword,
    } = this.state;

    const userInformation = {
      username: newUsername,
      password: newPassword,
      email: newEmail,
      phone_number: parseInt(newPhoneNumber, 10),
      location: '',
    };

    const formBody = this.jsonToFormData(userInformation);

    return serverApi.post('auth/adduser', formBody, 'application/x-www-form-urlencoded', '')
      .then((responseJson) => {
        const responseErr = this.handleSignUpReponse(responseJson);

        if (!responseErr.username && !responseErr.email) {
          this.authNewUser();
        }
      }).catch(error => console.log(error));
  }

  authNewUser = () => {
    const {
      newUsername, newEmail, newPhoneNumber, newPassword,
    } = this.state;
    const {
      navigation, loadProfileSuccess, storeJWTInit,
    } = this.props;

    const userInformation = {
      email: newEmail,
      password: newPassword,
    };

    const formBody = this.jsonToFormData(userInformation);

    serverApi.post('auth', formBody, 'application/x-www-form-urlencoded', '')
      .then((responseJson) => {
        const { token } = responseJson.data;

        const createdUserInformation = {
          location: '',
          username: newUsername,
          email: newEmail,
          phone_number: parseInt(newPhoneNumber, 10),
          create_time: '',
          game_score: {
            bike_score: 0,
            bikes_lost: 0,
            thumb_score: 0,
            total_score: 0,
          },
          loadingProfile: false,
          profileLoaded: true,
        };

        loadProfileSuccess(createdUserInformation);
        storeJWTInit(token);
        navigation.navigate('Location');
      }).catch(error => console.log(error));
  }

  handleSignUpReponse = (response) => {
    const { credStatus } = this.state;
    const respErrors = { email: false, username: false };
    const { message } = response;
    const { _message, errors } = message;

    if (_message === 'User validation failed') {
      if (errors.email) {
        respErrors.email = true;
        credStatus.newEmail = '`Email´ is already in use!';
      }
      if (errors.username) {
        respErrors.username = true;
        credStatus.newUsername = '`Username´ is already in use!';
      }
    }

    this.setState({ credStatus });
    return respErrors;
  }

  jsonToFormData = (details) => {
    const formBody = Object.entries(details).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    return formBody;
  }

  checkPasswordStrength = () => {
    const { newPassword } = this.state;

    if (newPassword.length < 8) {
      return '`Password´ has to be ATLEAST 8 characters!';
    }

    const conditions = {
      specialChar: false, number: false, lowerCase: false, upperCase: false,
    };
    for (let i = 0; i < newPassword.length; i += 1) {
      const currChar = newPassword.charAt(i);

      if (passChars.indexOf(currChar) > -1) {
        conditions.specialChar = true;
      } else if (passNumbs.indexOf(currChar) > -1) {
        conditions.number = true;
      } else if (passLowCase.indexOf(currChar) > -1) {
        conditions.lowerCase = true;
      } else if (passUpCase.indexOf(currChar) > -1) {
        conditions.upperCase = true;
      }

      if (conditions.specialChar && conditions.number
          && conditions.lowerCase && conditions.upperCase) {
        return '';
      }
    }

    let errorMsg = 'Missing';
    if (!conditions.specialChar) {
      errorMsg += ', `SPECIAL CHARACTER´';
    }
    if (!conditions.number) {
      errorMsg += ', `NUMBER´';
    }
    if (!conditions.lowerCase) {
      errorMsg += ', `LOWERCASE LETTER´';
    }
    if (!conditions.upperCase) {
      errorMsg += ', `UPPERCASE LETTER´';
    }

    return errorMsg;
  }

  verifyRequiredCredentials(sendToServer) {
    const {
      newUsername, newEmail, newPassword, newPasswordConfirm, clicked,
    } = this.state;
    const credStatus = {
      newUsername: '', newEmail: '', newPassword: '', newPasswordConfirm: '',
    };
    let numErr = 0;
    if (newUsername.trim() === '') {
      credStatus.newUsername = '`Username´ has to be specified';
      numErr += 1;
    }
    if (newEmail.trim() === '') {
      credStatus.newEmail = '`Email´ has to be specified';
      numErr += 1;
    } else if (!newEmail.includes('@')) {
      credStatus.newEmail = '`Email´ has to be a valid email-adress';
      numErr += 1;
    }
    if (newPassword.trim() === '') {
      credStatus.newPassword = '`Password´ has to be specified';
      numErr += 1;
    } else {
      credStatus.newPassword = this.checkPasswordStrength();
      if (credStatus.newPassword !== '') {
        numErr += 1;
      }
    }
    if (newPasswordConfirm.trim() === '') {
      credStatus.newPasswordConfirm = '`Password´ has to be confirmed';
      numErr += 1;
    }
    if (newPassword !== newPasswordConfirm) {
      credStatus.newPasswordConfirm = '`Password´ has to be matching';
      numErr += 1;
    }

    if (numErr === 0 && sendToServer) {
      this.createNewUser();
    }

    if (!clicked) {
      this.setState({ clicked: true });
    }
    this.setState({ credStatus });
  }

  render() {
    const {
      username, email, phoneNumber, password, clicked, credStatus,
    } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 140}>
        <Image style={styles.logo} source={logo} />
        <View style={styles.logoTextCont}>
          <Text style={styles.logoText}> Cykelinspektionen </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Username"
            underlineColorAndroid="transparent"
            value={username}
            onChangeText={text => this.setState({ newUsername: text })}
          />
        </View>
        {clicked && credStatus.newUsername !== '' && (
          <Text style={{ color: 'red' }}>{credStatus.newUsername}</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            value={email}
            onChangeText={text => this.setState({ newEmail: text })}
          />
        </View>
        {clicked && credStatus.newEmail !== '' && (
          <Text style={{ color: 'red' }}>{credStatus.newEmail}</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Phone number"
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            value={phoneNumber}
            onChangeText={text => this.setState({ newPhoneNumber: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry
            underlineColorAndroid="transparent"
            value={password}
            onChangeText={text => this.setState({ newPassword: text })}
          />
        </View>
        {clicked && credStatus.newPassword !== '' && (
          <Text style={{ color: 'red' }}>{credStatus.newPassword}</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Confirm Password"
            secureTextEntry
            underlineColorAndroid="transparent"
            value={password}
            onChangeText={text => this.setState({ newPasswordConfirm: text })}
          />
        </View>
        {clicked && credStatus.newPasswordConfirm !== '' && (
          <Text style={{ color: 'red' }}>{credStatus.newPasswordConfirm}</Text>
        )}
        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this.verifyRequiredCredentials(true)}
        >
          <Text style={styles.loginText}>Register</Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>
    );
  }
}

SignUp.propTypes = {
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
  storeJWTInit: PropTypes.func.isRequired,
  loadProfileSuccess: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...authActions, ...profileActions, ...jwtActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
