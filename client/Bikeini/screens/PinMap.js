import React from 'react';
import {
  Platform, View, Text, StyleSheet, Image, TouchableHighlight,
} from 'react-native';
import {
  Constants, Location, Permissions, MapView, IntentLauncherAndroid,
} from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as mapActions from '../navigation/actions/MapActions';
import { headerBackStyle } from './header';

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  map: {
    flex: 1,
    alignItems: 'flex-end',
  },
  marker: {
    height: 38,
    width: 38,
  },
  markerFixed: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    marginLeft: -20,
    marginTop: -10,
  },
  header: {
    flex: 0.1,
    backgroundColor: '#44ccad',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    marginTop: '5%',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonView: {
    height: 130,
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
  },
  buttonContainer: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    width: 150,
    borderRadius: 10,
  },
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
    color: 'white',
  },
});

const bikeIcon = require('../assets/images/biker.png');


// TO ACTUALLY USE THIS WHEN DEPLOYED THERE IS MORE STEPS! Especially on ANDROID.
class PinMap extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  state = {
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.getLocationAsync();
    }
  }

  getLocationAsync = async () => {
    const { setMapLocation } = this.props;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    const geocode = await Location.reverseGeocodeAsync(location.coords);
    setMapLocation({ ...location.coords, ...geocode[0] });
  };

  onRegionChangeComplete = async (region) => {
    const { setMapLocation } = this.props;
    const geocode = await Location.reverseGeocodeAsync({ latitude: region.latitude, longitude: region.longitude });
    geocode[0].street = geocode[0].street || '';
    geocode[0].postalCode = geocode[0].postalCode || '';
    setMapLocation({ ...region, ...geocode[0] });
  }

  handleSubmit = () => {
    const { mapState, setUserMarker, navigation } = this.props;
    setUserMarker({ latitude: mapState.latitude, longitude: mapState.longitude });
    navigation.goBack();
  }

  render() {
    const { mapState, navigation, cleanMapState } = this.props;
    if (mapState.marker.showMarker) {
      return (
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
            Marker shows tips location
            </Text>
          </View>
          <MapView
            style={styles.map}
            initialRegion={mapState.marker}
            onRegionChangeComplete={this.onRegionChangeComplete}
          >
            <MapView.Marker
              coordinate={{ latitude: mapState.marker.latitude, longitude: mapState.marker.longitude }}
            />
          </MapView>
          <View style={styles.buttonView}>
            <TouchableHighlight
              style={[styles.buttonContainer, styles.greenButton]}
              onPress={() => {
                cleanMapState();
                navigation.goBack();
              }}
            >
              <Text style={styles.greenButtonText}>Back</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }

    if (mapState.loadedCurrPos) {
      const { OS } = Platform;
      return (
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              The bike was stolen/found on this location
            </Text>
          </View>
          <MapView
            style={styles.map}
            initialRegion={mapState}
            onRegionChangeComplete={this.onRegionChangeComplete}
          />
          <Image style={[styles.markerFixed, styles.marker]} source={bikeIcon} />
          <View style={styles.buttonView}>
            <TouchableHighlight
              style={[styles.buttonContainer, styles.greenButton]}
              onPress={() => {
                cleanMapState();
                navigation.goBack();
              }}
            >
              <Text style={styles.greenButtonText}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.buttonContainer, styles.greenButton]} onPress={() => this.handleSubmit()}>
              <Text style={styles.greenButtonText}>Submit</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
}

/*
Marker implementation (real). Use this to calibrate the "fake marker"
<MapView.Marker
  // draggable
  coordinate={{ latitude: mapState.latitude, longitude: mapState.longitude }}
  // onDragEnd={e => setMapLocation(e.nativeEvent.coordinate )}
/>
*/

PinMap.propTypes = {
  mapState: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    latitudeDelta: PropTypes.number.isRequired,
    longitudeDelta: PropTypes.number.isRequired,
  }).isRequired,
  setMapLocation: PropTypes.func.isRequired,
  setUserMarker: PropTypes.func.isRequired,
  cleanMapState: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { mapState } = state;
  return { mapState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...mapActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(PinMap);
