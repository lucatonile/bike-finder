import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, Text, View, ScrollView, Image, FlatList, ImageBackground, RefreshControl,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import serverApi from '../utilities/serverApi';
import * as profileActions from '../navigation/actions/ProfileActions';

const profilePic = require('../assets/images/userPlaceholder.jpg');
const background = require('../assets/images/background.jpeg');


const styles = StyleSheet.create({
  background: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  profile: {
    flex: 0.38,
    height: undefined,
    width: undefined,
    margin: 10,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  rowContainer: {
    flex: 0.20,
    flexDirection: 'row',
  },
  columnContainer: {
    flex: 0.6,
    flexDirection: 'column',
    margin: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 4,
  },
  categories: {
    alignSelf: 'center',
    fontSize: 24,
    margin: '2%',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  UserInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 15,
  },
  scoreList: {
    flex: 1,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
    width: '88%',
    height: '90%',
  },
  topName: {
    fontSize: 18,
    marginBottom: '1%',
    fontWeight: 'bold',
  },
  topScore: {
    fontSize: 18,
    marginBottom: '1%',
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    right: '9%',
    fontWeight: 'bold',
  },
  backImg: {
    flex: 1,
    alignSelf: 'stretch',
  },
  listBack: {
    flex: 1,
    backgroundColor: 'white',
    width: '75%',
    left: '12%',
    paddingBottom: 15,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
  },
});

class Gamification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topPlayersSwe: '',
      topPlayersLocal: '',
      isFetching: false,
    };
  }

  componentDidMount() {
    this.handleServerTopPlayers();
  }

      handleServerTopPlayers = () => {
        const { authState, profileState } = this.props;
        const { jwt } = authState;

        const { location } = profileState;
        const topPlayersSwe = [];
        const topPlayersLocal = [];
        const topScoreSwe = {
          limit: 5,
        };
        const topScoreLocal = {
          limit: 5,
          location,
        };
        const formBody = JSON.stringify(topScoreSwe);
        const formBodyLocal = JSON.stringify(topScoreLocal);

        serverApi.post('users/gethighscores/', formBody, 'application/json', jwt[0])
          .then((responseJson) => {
            for (let i = 0; i < responseJson.length; i += 1) {
              topPlayersSwe.push(responseJson[i]);
            }
            this.setState({ topPlayersSwe, isFetching: false });
          }).catch(error => console.log(error));

        serverApi.post('users/gethighscores/', formBodyLocal, 'application/json', jwt[0])
          .then((responseJson) => {
            for (let i = 0; i < responseJson.length; i += 1) {
              topPlayersLocal.push(responseJson[i]);
            }
            this.setState({ topPlayersLocal, isFetching: false });
          }).catch(error => console.log(error));
      }

    renderSweList = () => {
      const { topPlayersSwe } = this.state;
      return (
        <View style={styles.scoreList}>
          <FlatList
            data={topPlayersSwe}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.rowContainer}>
                <Text style={styles.topName} adjustsFontSizeToFit>
                  {index + 1}
                .
                  {item.username}

                </Text>
                <Text style={styles.topScore} adjustsFontSizeToFit>
                  {item.game_score.total_score}
p
                </Text>
              </View>
            )}
          />
        </View>
      );
    }

    renderLocalList = () => {
      const { topPlayersLocal } = this.state;
      return (
        <View style={styles.scoreList}>
          <FlatList
            data={topPlayersLocal}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.rowContainer}>
                <Text style={styles.topName} adjustsFontSizeToFit>
                  {index + 1}
                  .
                  {item.username}

                </Text>
                <Text style={styles.topScore} adjustsFontSizeToFit>
                  {item.game_score.total_score}
  p
                </Text>
              </View>
            )}
          />
        </View>
      );
    }

    onRefresh = () => {
      this.setState({ isFetching: true }, () => {
        this.handleServerTopPlayers();
      });
    }

    onBackButtonPressAndroid = () => true;

    render() {
      const { isFetching } = this.state;
      const { profileState } = this.props;
      const { location } = profileState;
      const { game_score } = profileState;
      return (
        <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
          <ImageBackground style={styles.backImg} source={background}>
            <ScrollView
              style={styles.background}
              refreshControl={(
                <RefreshControl
                  onRefresh={this.onRefresh}
                  refreshing={isFetching}
                />
          )}
            >
              <View style={styles.container} />
              <View style={styles.rowContainer}>
                <Image style={styles.profile} source={profileState.avatarUri.thumbnail.length ? { uri: `${profileState.avatarUri.thumbnail}?time=${new Date()}` } : profilePic} />
                <View style={styles.columnContainer}>
                  <Text style={styles.UserInfo} adjustsFontSizeToFit>
                Found Bikes:
                    {' '}
                    {game_score.bike_score}
                  </Text>
                  <Text style={styles.UserInfo} adjustsFontSizeToFit>
                Helpful tips:
                    {' '}
                    {game_score.thumb_score}
                  </Text>
                  <Text style={styles.UserInfo} adjustsFontSizeToFit>
                Your stolen Bikes:
                    {' '}
                    {game_score.bikes_lost}
                  </Text>
                  <Text
                    style={[styles.UserInfo, { fontWeight: 'bold' },
                    ]}
                    adjustsFontSizeToFit
                  >
                Total points earned:
                    {' '}
                    {game_score.total_score}
                  </Text>
                </View>
              </View>
              <View style={styles.listBack}>
                <Text style={styles.categories} adjustsFontSizeToFit>
                  Top list in
                  {' '}
                  {location}
                  :
                </Text>
                <View>
                  {this.renderLocalList()}
                </View>
              </View>
              <Text>{' '}</Text>
              <View style={styles.listBack}>
                <Text style={styles.categories} adjustsFontSizeToFit>Top list in Sweden:</Text>
                <View>
                  {this.renderSweList()}
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
        </AndroidBackHandler>

      );
    }
}

Gamification.propTypes = {
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
};

const mapStateToProps = (state) => {
  const { authState, profileState } = state;
  return { authState, profileState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...profileActions },
  dispatch,
);


export default connect(mapStateToProps, mapDispatchToProps)(Gamification);
