import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Platform, ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import * as mapActions from '../navigation/actions/MapActions';
import Filter from '../components/Filter';
import Item from '../components/Item';
import serverApi from '../utilities/serverApi';

const background = require('../assets/images/background.jpeg');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerText: {
    marginTop: '5%',
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'white',
    shadowOpacity: 10.0,
    textDecorationLine: 'underline',
    textShadowOffset: { width: -1, height: 1 },
    textShadowColor: 'white',
    textShadowRadius: 5,
  },
  filter: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginLeft: '5%',
  },
  browserList: {
    flex: 1,
    alignSelf: 'center',
    margin: '1%',
    width: '95%',
  },
  showTypeLeft: {
    alignSelf: 'flex-start',
    position: 'relative',
    marginTop: '1%',
    left: 10,
  },
  showTypeRight: {
    alignSelf: 'flex-end',
    position: 'relative',
    marginTop: '1%',
    right: 10,
  },
  breakLine: {
    width: '100%',
    borderWidth: 0,
    borderBottomWidth: 2,
  },
  headerContainer: {
    backgroundColor: '#44ccad',
    width: '100%',
  },
});

class Browser extends React.Component {
  constructor() {
    super();

    this.state = {
      showMissing: true,
      missingBicycles: '',
      foundBicycles: '',
      showFilter: false,
      isFetching: false,
    };
  }

  componentDidMount() {
    this.handleServerBicycles();
  }

  handleServerBicycles = () => {
    const { authState, profileState } = this.props;
    const { jwt } = authState;
    const { location } = profileState;

    let formData = `type=FOUND&location.city=${location}`;

    serverApi.post('bikes/filterbikes', formData, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        this.setState({ foundBicycles: responseJson.message, isFetching: false });
      }).catch(error => console.log(error));

    formData = `type=STOLEN&location.city=${location}`;

    serverApi.post('bikes/filterbikes', formData, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        this.setState({ missingBicycles: responseJson.message, isFetching: false });
      }).catch(error => console.log(error));
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  };

  renderItem = ({ item }) => {
    if (!item.active) return null;
    const {
      navigation, profileState, setMarker, setShowMarker, authState,
    } = this.props;
    const bikeData = item;
    bikeData.showComments = true;// true = shows comments , false = shows similar bikes!
    // needed for items comment button
    bikeData.showResolveBike = profileState.username === bikeData.submitter.username;
    return (
      <TouchableOpacity
        onPress={() => {
          // This is if showcomments is false from profile
          bikeData.showResolveBike = profileState.username === bikeData.submitter.username;
          bikeData.showComments = true;// true = shows comments , false = shows similar bikes!
          navigation.navigate('BikeInformation', { bikeData, refresh: this.onRefresh });
        }}
      >
        <Item
          actions={{ setShowMarker, setMarker }}
          location={item.location || { lat: 0, long: 0 }}
          title={item.title || ''}
          brand={item.brand || ''}
          imageUrl={item.image_url.thumbnail || ''}
          bikeData={bikeData}
          commentsLength={bikeData.comments.length}
          navigation={navigation}
          refresh={this.onRefresh}
          authState={authState}
          matchingBikesCount={false}
        />
      </TouchableOpacity>
    );
  }

  renderHeader = () => {
    const { showMissing } = this.state;
    const { profileState } = this.props;
    const { location } = profileState;

    if (showMissing) {
      return (
        <View>
          <Text style={styles.headerText}>
            Missing bikes in
            {' '}
            {location}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
            Found bikes in
          {' '}
          {location}
        </Text>
      </View>
    );
  }

  switchPageType = () => {
    this.setState(prevState => ({
      showMissing: !prevState.showMissing,
    }));
  }

  renderFilter = () => {
    const { showFilter } = this.state;

    if (showFilter) {
      return <Filter search={this.search} hideFilter={this.hideFilter} />;
    }

    return null;
  }

  onRefresh = () => {
    this.setState({ isFetching: true }, () => {
      this.handleServerBicycles();
    });
  }

  renderList = () => {
    const {
      showMissing, missingBicycles, foundBicycles, isFetching,
    } = this.state;

    if (showMissing) {
      return (
        <View style={styles.browserList}>
          <FlatList
            data={missingBicycles}
            onRefresh={this.onRefresh}
            refreshing={isFetching}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
      );
    }


    return (
      <View style={styles.browserList}>
        <FlatList
          data={foundBicycles}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }

  renderSwitchType = () => {
    const { showMissing } = this.state;

    if (showMissing) {
      return (
        <TouchableOpacity
          style={styles.showTypeRight}
          onPress={this.switchPageType}
        >
          <Icon name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-dropright'} size={75} color="black" />
        </TouchableOpacity>
      );
    }


    return (
      <TouchableOpacity
        style={styles.showTypeLeft}
        onPress={this.switchPageType}
      >
        <Icon name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-dropleft'} size={80} color="black" />
      </TouchableOpacity>
    );
  }

  renderFilterHeader = () => {
    const { showFilter } = this.state;

    if (showFilter) {
      return (
        <TouchableOpacity
          style={styles.filter}
          onPress={this.changeFilterStatus}
        >
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            shadowOffset: { width: 1, height: 1 },
            shadowColor: 'white',
            shadowOpacity: 10.0,
          }}
          >
            Filter
            {' '}

          </Text>
          <Icon name="md-arrow-dropup" size={30} color="black" />
        </TouchableOpacity>
      );
    }


    return (
      <TouchableOpacity
        style={styles.filter}
        onPress={this.changeFilterStatus}
      >
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: 'white',
          shadowOpacity: 10.0,
          textShadowOffset: { width: -1, height: 1 },
          textShadowColor: 'white',
          textShadowRadius: 5,
        }}
        >
        Filter
          {' '}

        </Text>
        <Icon name="md-arrow-dropdown" size={30} color="black" />
      </TouchableOpacity>
    );
  }

  changeFilterStatus = () => {
    const { showFilter } = this.state;

    this.setState({ showFilter: !showFilter });
  }


  search = (searchOptions) => {
    const searchJson = searchOptions;
    const { showMissing } = this.state;
    const { authState, profileState } = this.props;
    const { jwt } = authState;
    const { location } = profileState;

    if (showMissing) {
      searchJson.type = 'STOLEN';
      let formData = Object.entries(searchJson).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
      formData += (`&location.city=${location}`);
      serverApi.post('bikes/filterbikes', formData, 'application/x-www-form-urlencoded', jwt[0])
        .then((responseJson) => {
          this.setState({ missingBicycles: responseJson.message, isFetching: false, showFilter: false });
        }).catch(error => console.log(error));
    } else {
      searchJson.type = 'FOUND';
      let formData = Object.entries(searchJson).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
      formData += (`&location.city=${location}`);
      serverApi.post('bikes/filterbikes', formData, 'application/x-www-form-urlencoded', jwt[0])
        .then((responseJson) => {
          this.setState({ foundBicycles: responseJson.message, isFetching: false, showFilter: false });
        }).catch(error => console.log(error));
    }
  }

  hideFilter = () => {
    this.setState({ showFilter: false });
  }

  onBackButtonPressAndroid = () => true;

  render() {
    const header = this.renderHeader();
    const filterHeader = this.renderFilterHeader();
    const filter = this.renderFilter();
    const list = this.renderList();
    const switchArrow = this.renderSwitchType();
    return (
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
        <View style={styles.container}>
          <ImageBackground style={styles.headerContainer} source={background}>
            {header}
            {switchArrow}
            {filterHeader}
          </ImageBackground>
          <View style={styles.breakLine} />
          {filter}
          {list}
        </View>
      </AndroidBackHandler>

    );
  }
}

Browser.propTypes = {
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
  setMarker: PropTypes.func.isRequired,
  setShowMarker: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...mapActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
