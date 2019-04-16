import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableHighlight, TextInput, Alert, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ButtonGroup } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import { ImagePicker, ImageManipulator, Location } from 'expo';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import permissions from '../utilities/permissions';
import * as mapActions from '../navigation/actions/MapActions';
import * as addBikeActions from '../navigation/actions/AddBikeActions';

const locationIcon = require('../assets/images/location.png');
const defaultBike = require('../assets/images/bikePlaceholder.png');
const cameraImg = require('../assets/images/camera.png');
const albumImg = require('../assets/images/album.png');

const styles = StyleSheet.create({

  parent: {
    flex: 1,
  },
  background: {
    backgroundColor: '#fff',
  },
  containerIos: {
    height: '75%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 100,
  },
  containerAndroid: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 100,
  },
  dropdowns: {
    width: '90%',
    marginLeft: '4%',
  },
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  smallButtonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 150,
    borderRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.2,
  },
  actionButton: {
    backgroundColor: '#00b5ec',
  },
  inputs: {
    height: '4%',
    width: '90%',
    marginLeft: '4%',
    marginBottom: '1%',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
  },
  thumbnail: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  placeholder: {
    width: 110,
    height: 100,
    marginLeft: 15,
  },
  icons: {
    width: '20%',
    height: '60%',
    marginLeft: '2%',
    left: '65%',
  },
  addPhotoButtons: {
    left: '15%',
  },
  greenButton: {
    backgroundColor: '#44ccad',
    borderRadius: 10,
  },
  greenButtonText: {
    color: 'white',
  },
  headerText: {
    fontSize: 18,
    margin: '2%',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  uploadPhotoButton: {
    flex: 1,
    alignSelf: 'center',
    width: '70%',
  },
  submitButton: {
    alignSelf: 'flex-end',
    marginRight: '4%',
  },
  radio: {
    flex: 0.2,
    alignSelf: 'center',
    width: '80%',
  },
  locationFrame: {
    flex: 1,
    width: '75%',
    borderWidth: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  adressFrame: {
    flex: 0.9,
    flexDirection: 'column',
    padding: 3,
  },
  locationTag: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    right: 2,
    height: '100%',
    width: '100%',
  },
  locationIconTouch: {
    flex: 0.1,
    padding: 1,
  },
});

class AddBike extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraRollPermission: null,
      hasCameraPermission: null,
      bikeData: {
        type: 'STOLEN',
        title: '',
        brand: '',
        model: '',
        color: '',
        frame_number: '',
        antitheft_code: '',
        description: '',
        lat: 0,
        long: 0,
        keywords: {
          frame_type: 'MALE',
          child: 0,
          sport: 0,
          tandem: 0,
          basket: 0,
          rack: 0,
          mudguard: 0,
          chain_protection: 0,
          net: 0,
          winter_tires: 0,
          light: 0,
        },
      },
      Color: [
        {
          value: 'Red',
        },
        {
          value: 'Green',
        },
        {
          value: 'Blue',
        },
        {
          value: 'White',
        },
        {
          value: 'Black',
        },
        {
          value: 'Gray',
        },
        {
          value: 'Orange',
        },
        {
          value: 'Pink',
        },
        {
          value: 'Purple',
        },
        {
          value: 'Silver',
        },
        {
          value: 'Yellow',
        },
      ],
    };
    this.cameraRollPermission = permissions.cameraRollPermission.bind(this);
    this.cameraPermission = permissions.cameraPermission.bind(this);
  }

  componentDidUpdate() {
    const { addBikeState, navigation, setBikePosted } = this.props;
    if (addBikeState.bikePosted) {
      setBikePosted(false);
      navigation.navigate('Browser');
    }
  }

  setServerResponse(response) {
    // console.log(response); // <- Used for checking the structure of the ML-response, please leave it until it's been testsed on live! :)
    const { bikeData } = this.state;

    if (response.bikefound === false) {
      Alert.alert('No bicycle found!\nTry again with a new image.');
      return;
    }
    // For this to work the response from the server CAN'T have any nestled attrbiutes!
    Object.keys(response).forEach((key) => {
      if (key === 'frame') {
        const frameKey = response[key];
        switch (frameKey) {
          case 'sport':
            bikeData.keywords.sport = 1;
            break;
          case 'male':
            bikeData.keywords.frame_type = 'MALE';
            break;
          case 'female':
            bikeData.keywords.frame_type = 'FEMALE';
            break;
          default:
            console.log(`Unknown key: ${frameKey}`);
            break;
        }
      } else if (key === 'color') {
        bikeData.color = response[key];
      } else {
        bikeData.keywords[key] = response[key] ? 1 : 0;
      }
    });
    this.setState({ bikeData });
  }

  startCameraRoll = () => {
    this.cameraRollPermission(this.pickImage);
  }

  startCamera = () => {
    this.cameraPermission(this.saveCamImage);
  }

  saveCamImage = async () => {
    const { hasCameraPermission } = this.state;
    if (!hasCameraPermission) {
      Alert.alert('No Access');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      exif: true,
    });
    if (!result.cancelled) {
      const { saveImageToState, setMapLocation } = this.props;
      const { bikeData } = this.state;
      saveImageToState(result.uri);
      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      setMapLocation({ ...geocode[0] });
      this.setState({ bikeData: { ...bikeData, lat: location.coords.latitude, long: location.coords.longitude } });
    }
  }

  pickImage = async () => {
    const { hasCameraRollPermission } = this.state;
    if (!hasCameraRollPermission) {
      Alert.alert('No Access');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      exif: true,
    });

    if (!result.cancelled) {
      const { saveImageToState, setMapLocation } = this.props;
      saveImageToState(result.uri);
      if (result.exif.GPSLatitude && result.exif.GPSLongitude) {
        const { bikeData } = this.state;
        const geocode = await Location.reverseGeocodeAsync({ latitude: result.exif.GPSLatitude, longitude: result.exif.GPSLongitude });
        setMapLocation({ ...geocode[0] });
        this.setState({ bikeData: { ...bikeData, lat: result.exif.GPSLatitude, long: result.exif.GPSLongitude } });
      }
    }
  };

  setBikeData = (attr, value, setKeyword) => {
    const { bikeData } = this.state;
    if (setKeyword) {
      const { keywords } = bikeData;
      keywords[attr] = value;
    } else {
      bikeData[attr] = value;
    }
    this.setState({ bikeData });
  }

  compressUri = async (imgUri) => {
    try {
      const compressedUri = await ImageManipulator.manipulateAsync(
        imgUri,
        [{ resize: { width: 250, height: 250 } }],
        {
          compress: 1,
          format: 'jpeg',
        },
      );
      return compressedUri;
    } catch (err) {
      console.log(err);
    }
    return imgUri;
  }

  handleSubmitt = () => {
    const {
      mapState, uploadBikeToServer, addBikeState, authState,
    } = this.props;
    const { userMarker } = mapState;
    const { bikeData } = this.state;
    if (!bikeData.lat && !userMarker.userMarkerSet) {
      Alert.alert('Please set a location');
      return;
    }
    if (!bikeData.title || !bikeData.brand || !bikeData.description) {
      Alert.alert('Please make sure your ad contains a title, brand-information and description');
      return;
    }
    if (userMarker.userMarkerSet) {
      bikeData.lat = userMarker.latitude;
      bikeData.long = userMarker.longitude;
      uploadBikeToServer(addBikeState.imgToUploadUri, bikeData, authState.jwt[0]);
    } else {
      uploadBikeToServer(addBikeState.imgToUploadUri, bikeData, authState.jwt[0]);
    }

    let resetBikeData = bikeData;
    resetBikeData.title = '';
    resetBikeData.brand = '';
    resetBikeData.color = '';
    resetBikeData.model = '';
    resetBikeData.frame_number = '';
    resetBikeData.antitheft_code = '';
    resetBikeData.description = '';
    this.setState({bikeData: resetBikeData});
  }

  onBackButtonPressAndroid = () => true;

  render() {
    const {
      authState, addBikeState, navigation, imgUploadInit, mapState,
    } = this.props;
    const {
      Color, bikeData,
    } = this.state;
    const {
      color,
    } = bikeData;
    if (addBikeState.uploadingBike) {
      return (
        <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
          <View style={styles.container}>
            <Text>Posting Ad...</Text>
          </View>
        </AndroidBackHandler>

      );
    }
    return (
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
        <KeyboardAvoidingView style={styles.parent} behavior="position" enabled keyboardVerticalOffset={Platform.OS === 'ios' ? 15 : 30}>
          <ScrollView style={styles.background}>
            <View style={Platform.OS === 'ios' ? styles.containerIos : styles.containerAndroid}>
              <Text style={styles.headerText}>
          Add a picture of your bike
              </Text>
              <View style={styles.rowContainer}>
                <View>
                  {!addBikeState.uriSet && <Image source={defaultBike} style={styles.placeholder} /> }
                  {addBikeState.uriSet && <Image source={{ uri: addBikeState.imgToUploadUri }} style={styles.thumbnail} />}
                </View>
                <View>
                  <View style={styles.rowContainer}>
                    <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton, styles.greenButton, styles.addPhotoButtons]} onPress={this.startCameraRoll}>
                      <Text style={styles.greenButtonText}>ADD FROM ALBUM</Text>
                    </TouchableHighlight>
                    <Image
                      style={styles.icons}
                      source={albumImg}
                    />
                  </View>
                  <View style={styles.rowContainer}>
                    <TouchableHighlight style={[styles.smallButtonContainer, styles.actionButton, styles.greenButton, styles.addPhotoButtons]} onPress={this.startCamera}>
                      <Text style={styles.greenButtonText}>TAKE A PHOTO</Text>
                    </TouchableHighlight>
                    <Image
                      style={styles.icons}
                      source={cameraImg}
                    />
                  </View>
                </View>
              </View>
              <TouchableHighlight
                style={[
                  styles.smallButtonContainer,
                  styles.actionButton,
                  styles.greenButton,
                  styles.uploadPhotoButton,
                  !addBikeState.uploadDisabled ? [] : [styles.buttonDisabled],
                ]}
                disabled={addBikeState.uploadDisabled}
                onPress={() => {
                  this.compressUri(addBikeState.imgToUploadUri).then((compressedUri) => {
                    imgUploadInit(compressedUri.uri, bikeData.type, authState.jwt[0])
                      .then(response => this.setServerResponse(response));
                  });
                }
            }
              >
                <Text style={styles.greenButtonText}>UPLOAD IMAGE</Text>
              </TouchableHighlight>
              <Text style={styles.headerText}>
              Last known location of the reported bike:
              </Text>
              <View style={styles.locationFrame}>
                <View style={styles.adressFrame}>
                  <Text>
                City:
                    {' '}
                    {mapState.city}
                    {' '}
                  </Text>
                  <Text>
                Street:
                    {' '}
                    {mapState.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.locationIconTouch}
                  onPress={() => navigation.navigate('PinMap')}
                >
                  <Image
                    style={styles.locationTag}
                    source={locationIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.radio}>
                <Text style={styles.headerText}> Fill in characteristics about the bike:</Text>
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('type', data ? 'FOUND' : 'STOLEN'); }}
                  selectedIndex={bikeData.type === 'STOLEN' ? 0 : 1}
                  buttons={['Stolen', 'Found']}
                  containerStyle={{ height: 30 }}
                />

                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('frame_type', data ? 'FEMALE' : 'MALE', true); }}
                  selectedIndex={bikeData.keywords.frame_type === 'MALE' ? 0 : 1}
                  buttons={['Male', 'Female']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('child', data, true); }}
                  selectedIndex={bikeData.keywords.child}
                  buttons={['Adult', 'Child']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('sport', data, true); }}
                  selectedIndex={bikeData.keywords.sport}
                  buttons={['Casual', 'Sport']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('tandem', data, true); }}
                  selectedIndex={bikeData.keywords.tandem}
                  buttons={['Single', 'Tandem']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('rack', data, true); }}
                  selectedIndex={bikeData.keywords.rack}
                  buttons={['No Rack', 'Rack']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('basket', data, true); }}
                  selectedIndex={bikeData.keywords.basket}
                  buttons={['No Basket', 'Basket']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('mudguard', data, true); }}
                  selectedIndex={bikeData.keywords.mudguard}
                  buttons={['No Mudguard', 'Mudguard']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('chain_protection', data, true); }}
                  selectedIndex={bikeData.keywords.chain_protection}
                  buttons={['No Chain Protector', 'Chain Protector']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('net', data, true); }}
                  selectedIndex={bikeData.keywords.net}
                  buttons={['No Net', 'Net']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('winter_tires', data, true); }}
                  selectedIndex={bikeData.keywords.winter_tires}
                  buttons={['Summer Tires', 'Winter Tires']}
                  containerStyle={{ height: 30 }}
                />
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: '#44ccad' }}
                  selectedTextStyle={{ color: 'white' }}
                  onPress={(data) => { this.setBikeData('light', data, true); }}
                  selectedIndex={bikeData.keywords.light}
                  buttons={['No Light', 'Light']}
                  containerStyle={{ height: 30 }}
                />
              </View>
              <View style={styles.dropdowns}>
                <Dropdown
                  value={color}
                  itemCount={5}
                  label="Color"
                  data={Color}
                  onChangeText={value => this.setBikeData('color', value)}
                />
              </View>
              <TextInput
                style={styles.inputs}
                placeholder="Frame number"
                underlineColorAndroid="transparent"
                keyboardType="numeric"
                value={bikeData.frame_number}
                onChangeText={text => this.setBikeData('frame_number', text)}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Anti Theft Code"
                underlineColorAndroid="transparent"
                value={bikeData.antitheft_code}
                onChangeText={text => this.setBikeData('antitheft_code', text)}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Brand*"
                underlineColorAndroid="transparent"
                value={bikeData.brand}
                onChangeText={text => this.setBikeData('brand', text)}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Model"
                underlineColorAndroid="transparent"
                value={bikeData.model}
                onChangeText={text => this.setBikeData('model', text)}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Title*"
                underlineColorAndroid="transparent"
                value={bikeData.title}
                onChangeText={text => this.setBikeData('title', text)}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Description*"
                underlineColorAndroid="transparent"
                value={bikeData.description}
                onChangeText={text => this.setBikeData('description', text)}
              />
              <TouchableHighlight
                style={[styles.smallButtonContainer, styles.actionButton, styles.greenButton, styles.submitButton]}
                onPress={() => {
                  if (!addBikeState.uriSet) {
                    Alert.alert('Picture is mandatory!');
                    return;
                  }
                  this.handleSubmitt();
                }
            }
              >
                <Text style={styles.greenButtonText}>SUBMIT</Text>
              </TouchableHighlight>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </AndroidBackHandler>
    );
  }
}

AddBike.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  addBikeState: PropTypes.shape({
    imgToUploadUri: PropTypes.string.isRequired,
    bikePosted: PropTypes.bool.isRequired,
  }).isRequired,
  authState: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    jwt: PropTypes.array.isRequired,
  }).isRequired,
  imgUploadInit: PropTypes.func.isRequired,
  uploadBikeToServer: PropTypes.func.isRequired,
  setBikePosted: PropTypes.func.isRequired,
  mapState: PropTypes.shape({
    city: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    userMarker: PropTypes.shape({
      userMarkerSet: PropTypes.bool.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { addBikeState, authState, mapState } = state;
  return { addBikeState, authState, mapState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...addBikeActions, ...mapActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(AddBike);
