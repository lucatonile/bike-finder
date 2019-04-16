// Inspired by guide from expo camerja repository
// NOW DEPRECATED
import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import {
  Constants, Camera, FileSystem,
} from 'expo';
import {
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import permissions from '../utilities/permissions';
import * as addBikeActions from '../navigation/actions/AddBikeActions';
import { headerBackStyle } from './header';


const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const wbIcons = {
  auto: 'wb-auto',
  sunny: 'wb-sunny',
  cloudy: 'wb-cloudy',
  shadow: 'beach-access',
  fluorescent: 'wb-iridescent',
  incandescent: 'wb-incandescent',
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Constants.statusBarHeight / 2,
  },
  bottomBar: {
    paddingBottom: 25,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    flex: 0.12,
    flexDirection: 'row',
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomButton: {
    flex: 0.3,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    position: 'absolute',
    bottom: 80,
    left: 30,
    width: 200,
    height: 160,
    backgroundColor: '#000000BA',
    borderRadius: 4,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
});

class CameraPage extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  constructor() {
    super();
    this.state = {
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      type: 'back',
      whiteBalance: 'auto',
      pictureSize: undefined,
      pictureSizes: [],
      pictureSizeId: 0,
      showMoreOptions: false,
      hasCameraPermission: false,
    };
    this.cameraPermission = permissions.cameraPermission.bind(this);
    this.cameraPermission();
  }

  componentDidMount() {
    FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}photos`).catch((e) => {
      console.log(e, 'Directory exists');
    });
  }

  toggleMoreOptions = () => {
    const { showMoreOptions } = this.state;
    this.setState({ showMoreOptions: !showMoreOptions });
  }

  toggleFacing = () => {
    const { type } = this.state;
    this.setState({ type: type === 'back' ? 'front' : 'back' });
  }

  toggleFlash = () => {
    const { flash } = this.state;
    this.setState({ flash: flashModeOrder[flash] });
  }

  toggleWB = () => {
    const { whiteBalance } = this.state;
    this.setState({ whiteBalance: wbOrder[whiteBalance] });
  }

  toggleFocus = () => {
    const { autoFocus } = this.state;
    this.setState({ autoFocus: autoFocus === 'on' ? 'off' : 'on' });
  }

  zoomOut = () => {
    const { zoom } = this.state;
    this.setState({ zoom: zoom - 0.1 < 0 ? 0 : zoom - 0.1 });
  }

  zoomIn = () => {
    const { zoom } = this.state;
    this.setState({ zoom: zoom + 0.1 > 1 ? 1 : zoom + 0.1 });
  };

  setFocusDepth = depth => this.setState({ depth });

  toggleFaceDetection = () => {
    const { faceDetecting } = this.state;
    this.setState({ faceDetecting: !faceDetecting });
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({ exif: true, onPictureSaved: this.setUriDetails });
      const { navigation } = this.props;
      navigation.navigate('AddBike');
    }
  };

  handleMountError = ({ message }) => console.error(message);

  setUriDetails = (photo) => {
    const { saveImageToState } = this.props;
    saveImageToState(photo.uri);
  }

  previousPictureSize = () => this.changePictureSize(1, this.state);

  nextPictureSize = () => this.changePictureSize(-1, this.state);

  changePictureSize = (direction, state) => {
    let newId = state.pictureSizeId + direction;
    const { pictureSizes } = state;
    const { length } = pictureSizes;
    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length - 1;
    }
    this.setState({ pictureSize: pictureSizes[newId], pictureSizeId: newId });
  }

renderNoPermissions = () => (
  <View style={styles.noPermissions}>
    <Text style={{ color: 'white' }}>
        Camera permissions not granted - cannot open camera preview.
    </Text>
  </View>
)

renderTopBar = (state => (
  <View
    style={styles.topBar}
  >
    <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFacing}>
      <Ionicons name="ios-reverse-camera" size={32} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFlash}>
      <MaterialIcons name={flashIcons[state.flash]} size={32} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.toggleButton} onPress={this.toggleWB}>
      <MaterialIcons name={wbIcons[state.whiteBalance]} size={32} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFocus}>
      <Text style={[styles.autoFocusLabel, { color: state.autoFocus === 'on' ? 'white' : '#6b6b6b' }]}>AF</Text>
    </TouchableOpacity>
  </View>
))

renderBottomBar = () => (
  <View
    style={styles.bottomBar}
  >
    <View style={{ flex: 0.4 }}>
      <TouchableOpacity
        onPress={this.takePicture}
        style={{ alignSelf: 'center' }}
      >
        <Ionicons name="ios-radio-button-on" size={70} color="white" />
      </TouchableOpacity>
    </View>
  </View>
)

renderCamera = (state => (
  <View style={{ flex: 1 }}>
    <Camera
      ref={(ref) => {
        this.camera = ref;
      }}
      style={styles.camera}
      onCameraReady={this.collectPictureSizes}
      type={state.type}
      flashMode={state.flash}
      autoFocus={state.autoFocus}
      zoom={state.zoom}
      whiteBalance={state.whiteBalance}
      pictureSize={state.pictureSize}
      onMountError={this.handleMountError}
    >
      {this.renderTopBar(this.state)}
      {this.renderBottomBar()}
    </Camera>
  </View>
));

render() {
  const { hasCameraPermission } = this.state;
  const cameraScreenContent = hasCameraPermission ? this.renderCamera(this.state) : this.renderNoPermissions();
  return <View style={styles.container}>{cameraScreenContent}</View>;
}
}

CameraPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  addBikeState: PropTypes.shape({
    imgToUploadUri: PropTypes.string.isRequired,
  }).isRequired,
  saveImageToState: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => {
  const { addBikeState } = state;
  return { addBikeState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...addBikeActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(CameraPage);
