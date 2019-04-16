import React from 'react';
import {
  StyleSheet, View, Text, Image, FlatList, TouchableHighlight, TextInput,
} from 'react-native';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Constants } from 'expo';
import { CheckBox } from 'react-native-elements';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import cities from '../assets/Cities';
import * as profileActions from '../navigation/actions/ProfileActions';
import serverApi from '../utilities/serverApi';
import { headerStyle } from './header';

const logo = require('../assets/images/biker.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  buttonContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    width: 150,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#44ccad',
  },
  loginText: {
    color: 'white',
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 35,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    width: 400,
    height: 40,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  city: {
    width: 400,
  },
  logo: {
    height: 100,
    width: 100,
  },
});

class Location extends React.Component {
  static navigationOptions = {
    ...headerStyle,
  };

  constructor() {
    super();
    this.state = {
      checked: '',
      data: cities,
      searchText: '',
    };
  }

checkItem = (item) => {
  const { checked } = this.state;
  if (checked !== item) {
    this.setState({ checked: item });
  } else if (checked === item) {
    this.setState({ checked: '' });
  }
};

sendLocationToServer = () => {
  const { checked } = this.state;
  const { navigation } = this.props;
  if (!checked.length) {
    return;
  }
  const { authState, setLocation } = this.props;
  const body = JSON.stringify({ location: checked });
  serverApi.post('users/updateuser/', body, 'application/json', authState.jwt[0]);
  setLocation(checked);
  navigation.navigate('Browser');
}

searchFilterFunction = (text) => {
  const newData = cities.filter((item) => {
    const itemData = item.toUpperCase();
    const textData = text.toUpperCase();

    return itemData.indexOf(textData) > -1;
  });

  this.setState({ data: newData, searchText: text });
};

onBackButtonPressAndroid = () => true;

render() {
  const { checked, searchText, data } = this.state;
  return (
    <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>

      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <Text style={styles.heading}>SELECT CITY</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Search for a city..."
            value={searchText}
            onChangeText={text => this.searchFilterFunction(text)}
          />
        </View>
        <FlatList
          style={styles.city}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
          renderItem={({ item }) => (
            <CheckBox
              title={item}
              onPress={() => this.checkItem(item)}
              checked={checked.includes(item)}
            />
          )}
        />
        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => {
            this.sendLocationToServer();
          // navigation.navigate(this.logOutUser);
          }}
        >
          <Text style={styles.loginText}>Submit</Text>
        </TouchableHighlight>
      </View>
    </AndroidBackHandler>
  );
}
}


Location.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  setLocation: PropTypes.func.isRequired,
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
};

const mapStateToProps = (state) => {
  const { profileState, authState } = state;
  return { profileState, authState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...profileActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Location);
