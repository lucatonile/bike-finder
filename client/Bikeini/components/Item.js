import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import serverApi from '../utilities/serverApi';

const emptyCommentIcon = require('../assets/images/emptyComment.png');
const locationIcon = require('../assets/images/location.png');
const stockBicycle = require('../assets/images/stockBicycle.png');

const styles = StyleSheet.create({
  item: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    height: 100,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  image: {
    alignSelf: 'center',
    width: 90,
    height: 90,
    marginLeft: '3%',
    backgroundColor: 'blue',
  },
  textView: {
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: '5%',
    marginLeft: '5%',
    flexWrap: 'wrap',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
  brand: {
    fontSize: 16,
    fontWeight: '500',
  },
  matchingNum: {
    fontSize: 25,
    fontWeight: '500',
  },
  commentsTag: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  locationTag: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  buttonRow: {
    flex: 0.25,
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
  },
  commentsNumber: {
    position: 'absolute',
    top: 3,
    left: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class Item extends React.Component {
  constructor() {
    super();
    this.state = {
      matchingBikes: 0,
    };
  }

  componentDidMount() {
    const { bikeData, matchingBikesCount } = this.props;
    if (matchingBikesCount) this.getNumOfMatchingBikes(bikeData);
  }

  handleLocation = () => {
    const { actions, location, navigation } = this.props;
    actions.setMarker({ latitude: location.lat, longitude: location.long });
    actions.setShowMarker(true);
    navigation.navigate('PinMap');
  }

  getNumOfMatchingBikes = (bikeData) => {
    const { authState } = this.props;
    const { jwt } = authState;
    const formBody = this.jsonToFormData(bikeData);
    serverApi.post('bikes/getmatchingbikes', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        const matchingBikesFiltered = responseJson.filter(x => x.active === true);
        this.setState({ matchingBikes: matchingBikesFiltered.length });
      }).catch(error => console.log(error));
  }

  jsonToFormData = (details) => {
    const formBody = Object.entries(details).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    return formBody;
  }

  render() {
    const {
      title, brand, imageUrl, bikeData, navigation, refresh, location, commentsLength, matchingBikesCount,
    } = this.props;
    const imgSource = imageUrl ? { uri: imageUrl } : stockBicycle;
    let locationButton = null;
    let matchingNum = null;
    if (location.lat && location.long) {
      locationButton = (
        <TouchableOpacity
          style={styles.locationTag}
          onPress={() => this.handleLocation()}
        >
          <Image style={styles.locationTag} source={locationIcon} />
        </TouchableOpacity>
      );
    }
    if (matchingBikesCount) {
      const { matchingBikes } = this.state;
      matchingNum = (
        <Text style={styles.matchingNum}>
          {matchingBikes}
        </Text>
      );
    }
    return (
      <View style={styles.item}>
        <Image style={styles.image} source={imgSource} />
        <View style={styles.textView}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.brand}>
            {brand}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.commentsTag}
            onPress={() => {
              bikeData.showComments = true;
              navigation.navigate('BikeInformation', { bikeData, refresh });
            }}
          >
            <Image style={styles.commentsTag} source={emptyCommentIcon} />
            <Text style={styles.commentsNumber}>
              {commentsLength}
            </Text>
          </TouchableOpacity>
          {locationButton}
          {matchingNum}
        </View>
      </View>
    );
  }
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  bikeData: PropTypes.shape({
    showComments: PropTypes.bool.isRequired,
  }).isRequired,
  commentsLength: PropTypes.number.isRequired,
  refresh: PropTypes.func.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    long: PropTypes.number.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    setShowMarker: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
  }).isRequired,
  authState: PropTypes.shape({
    jwt: PropTypes.array.isRequired,
  }),
  matchingBikesCount: PropTypes.bool.isRequired,
};
