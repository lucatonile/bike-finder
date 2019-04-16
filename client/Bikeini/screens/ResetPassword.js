import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight, Image, KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { headerBackStyle } from './header';

import * as ResetPasswordActions from '../navigation/actions/ResetPasswordActions';

const logo = require('../assets/images/biker.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    top: -55,
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
  buttonContainer: {
    top: -45,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    width: 250,
  },
  requestButton: {
    marginTop: 35,
    backgroundColor: '#44ccad',
  },
  loginText: {
    color: 'white',
  },
  logo: {
    top: -65,
    height: 130,
    width: 130,
  },
  logoTextCont: {
    top: -65,
    marginTop: 5,
    marginBottom: 25,
  },
  logoText: {
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 14,
  },
});


class ResetPassword extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  constructor(props) {
    super(props);
    this.state = {
      emailOrUserName: '',
    };
  }

  componentDidUpdate() {
    const { resetState, navigation, requestNewPasswordReset } = this.props;
    if (!resetState.loadingReset && resetState.passwordResetDone && resetState.error === '') {
      navigation.navigate('Login');
      requestNewPasswordReset();
    }
  }
  /*
  getErrorMessage(error) {
    return error;
  }
  */

  requestNewPassword = () => {
    const { emailOrUserName } = this.state;
    const { requestNewPasswordInit } = this.props;
    requestNewPasswordInit(emailOrUserName);
  }

  render() {
    const { emailOrUserName } = this.state;
    const { resetState } = this.props;
    if (resetState.loadingReset) {
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
            placeholder="Username or Email"
            underlineColorAndroid="transparent"
            value={emailOrUserName}
            onChangeText={text => this.setState({ emailOrUserName: text })}
          />
        </View>
        <Text style={{ color: 'red', top: -45 }}>
          { resetState.error ? resetState.error : ''}
        </Text>
        <TouchableHighlight
          style={[styles.buttonContainer, styles.requestButton]}
          onPress={() => this.requestNewPassword()}
        >
          <Text style={styles.loginText}>Request new password</Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>

    );
  }
}

ResetPassword.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  resetState: PropTypes.shape({
    init: PropTypes.bool.isRequired,
    loadingReset: PropTypes.bool.isRequired,
    passwordResetDone: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
  requestNewPasswordInit: PropTypes.func.isRequired,
  requestNewPasswordReset: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  const { resetState } = state;
  return { resetState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...ResetPasswordActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
