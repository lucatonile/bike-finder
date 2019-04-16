import React from 'react';
import {
  Alert, ImageBackground, StyleSheet, Text, View, TextInput, TouchableHighlight, KeyboardAvoidingView,
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { headerBackStyle } from './header';
import * as profileActions from '../navigation/actions/ProfileActions';
import * as authActions from '../navigation/actions/AuthActions';

const background = require('../assets/images/background.jpeg');

const styles = StyleSheet.create({


  background: {
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  container: {
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 2,
    margin: 20,
    padding: 30,
    backgroundColor: 'white',
  },

  backImg: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
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
  buttonContainer: {
    height: 45,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  requestButton: {
    marginTop: 35,
    backgroundColor: '#44ccad',
  },
  removeButton: {
    alignItems: 'center',

    marginTop: 35,
    backgroundColor: '#e2715a',
  },
  loginText: {
    color: 'white',
  },
  locationText: {
    backgroundColor: 'white',
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 18,
  },
});

const passLowCase = 'abcdefghijklmnopqrstuvwxyz';
const passUpCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const passNumbs = '1234567890';
const passChars = ' !"#$%&()*+,-./:;<=>?@[\]^_`{|}~';

class EditProfile extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      newPassword2: '',
      credStatus: {},
    };
  }

  componentDidMount() {
    const { updateReset, deleteReset } = this.props;
    updateReset();
    deleteReset();
  }

  componentDidUpdate() {
    const { authState, navigation, unloadProfile } = this.props;
    const { deleteUser } = authState;
    if (deleteUser.userdeleted && !authState.jwt[0] && !unloadProfile.profileLoaded) {
      navigation.navigate('Login');
    }
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


  changePassword = () => {
    const {
      newPassword, newPassword2,
    } = this.state;
    let numErr = 0;
    const credStatus = {
      newPassword: '', newPassword2: '',
    };

    credStatus.newPassword = this.checkPasswordStrength();
    if (credStatus.newPassword !== '') {
      numErr += 1;
    }

    if (newPassword !== newPassword2) {
      credStatus.newPassword2 = '`Password´ has to be matching';
      numErr += 1;
    }

    if (newPassword.trim() === '') {
      credStatus.newPassword = '`Password´ has to be specified';
      numErr += 1;
    }
    this.setState({ credStatus });
    if (numErr === 0) {
      this.updateProfile();
    } else {
      const { updateReset } = this.props;
      updateReset();
    }
  }

  updateProfile = () => {
    const { newPassword } = this.state;
    const { updateUserInit, authState } = this.props;

    const newUser = {
      password: newPassword,
    };
    updateUserInit(newUser, authState.jwt[0]);
  }

  changeLocation = () => {
    const { navigation } = this.props;
    navigation.navigate('Location');
  }

  deleteUser = () => {
    const { profileState, deleteUserInit, authState } = this.props;
    Alert.alert(
      'Warning',
      'Are you sure you want to remove your account?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Yes', onPress: () => { deleteUserInit(profileState.email, authState.jwt[0]); } },
      ],
      { cancelable: false },
    );
  }

  render() {
    const { profileState, authState } = this.props;
    const { newPassword, newPassword2, credStatus } = this.state;
    const { location } = profileState;
    const { deleteUser } = authState;
    const { updateProfile } = profileState;
    let success = '';

    if (!updateProfile.loadingUpdate && updateProfile.updateDone && updateProfile.error === '') {
      success = 'Password succesfully changed';
    }

    if (updateProfile.loadingUpdate || deleteUser.deletingUser) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (

      <ImageBackground style={styles.backImg} source={background}>
        <KeyboardAvoidingView behavior="padding" style={styles.background} enabled>
          <View style={styles.container}>
            <Text style={styles.locationText}>
              {'Current Location: '}
              { location }
              {' '}
            </Text>
            <TouchableHighlight
              style={[styles.buttonContainer, styles.requestButton]}
              onPress={() => this.changeLocation()}
            >
              <Text style={styles.loginText}>Change Location</Text>
            </TouchableHighlight>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder="New password"
                underlineColorAndroid="transparent"
                secureTextEntry
                value={newPassword}
                onChangeText={text => this.setState({ newPassword: text })}
              />
            </View>
            <Text style={{ color: 'red' }}>{credStatus.newPassword}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder="Repeat new password"
                underlineColorAndroid="transparent"
                secureTextEntry
                value={newPassword2}
                onChangeText={text => this.setState({ newPassword2: text })}
              />
            </View>
            <Text style={{ color: 'red' }}>{credStatus.newPassword2}</Text>
            <TouchableHighlight
              style={[styles.buttonContainer, styles.requestButton]}
              onPress={() => this.changePassword()}
            >
              <Text style={styles.loginText}>Change password</Text>
            </TouchableHighlight>
            <Text style={{ color: 'blue' }}>{success}</Text>
            <TouchableHighlight
              style={[styles.buttonContainer, styles.removeButton]}
              onPress={() => this.deleteUser()}
            >
              <Text style={styles.loginText}>Remove Account</Text>
            </TouchableHighlight>

          </View>
        </KeyboardAvoidingView>

      </ImageBackground>


    );
  }
}

EditProfile.propTypes = {
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
    imgToUploadUri: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.number.isRequired,
    create_time: PropTypes.string.isRequired,
    avatarUri: PropTypes.shape({
      img: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
    }).isRequired,
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
  updateUserInit: PropTypes.func.isRequired,
  updateReset: PropTypes.func.isRequired,
  deleteUserInit: PropTypes.func.isRequired,
  deleteReset: PropTypes.func.isRequired,
  unloadProfile: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...profileActions, ...authActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
