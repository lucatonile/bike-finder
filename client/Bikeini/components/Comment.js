import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, Alert, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import serverApi from '../utilities/serverApi';
import { thumbScore, bikeScore } from '../utilities/Const';

const locationIcon = require('../assets/images/location.png');
const thumbUpIcon = require('../assets/images/thumbupNoBack.png');
const thumbDownIcon = require('../assets/images/thumbdownNoBack.png');
const FoundBike = require('../assets/images/FoundBike.png');
const userPlaceholder = require('../assets/images/userPlaceholder.jpg');

const styles = StyleSheet.create({
  commentWrap: {
    flexDirection: 'column',
    flex: 1,
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  commentWrapReply: {
    flexDirection: 'column',
    flex: 1,
    paddingBottom: 2,
    width: '90%',
    alignSelf: 'flex-end',
  },
  item: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    height: 75,
    borderWidth: 0,
  },
  image: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    marginLeft: '3%',
    backgroundColor: 'blue',
  },
  textView: {
    flex: 1,
    alignSelf: 'flex-start',
    flexDirection: 'column',
    marginTop: 5,
    marginBottom: '5%',
    marginLeft: '5%',
  },
  userText: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
  },
  locationTag: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    width: 25,
    height: 27,
    bottom: 6,
  },
  thumbDownTag: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    width: 25,
    height: 27,
    bottom: 6,
  },
  thumbUpTag: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    width: 25,
    height: 27,
    bottom: 6,
  },
  FoundTag: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    width: 28,
    height: 27,
    bottom: 6,
  },
  totalThumbs: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    height: 27,
    bottom: 12,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  answer: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'flex-end',
    left: '25%',
    bottom: 4,
  },
  answerWithReplyField: {
    alignSelf: 'flex-start',
    left: '25%',
  },
  answerText: {
    fontWeight: '700',
  },
  setGreen: {
    backgroundColor: 'green',
  },
  setRed: {
    backgroundColor: 'red',
  },
  ownCommentThumbs: {
    opacity: 0.2,
  },
  ownCommentTotal: {
    opacity: 0.4,
  },
  separate: {
    marginRight: 2,
  },
});

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbDown: false,
      thumbUp: false,
      answer: false,
      replyText: '', // not unsused...just not used here => bikeinformation
      showReplys: false,
    };
  }

  componentDidMount() {
    const { myId, rating } = this.props;
    rating.up.every(item => (item.userId === myId ? this.setState({ thumbUp: true }) : null));
    rating.down.every(item => (item.userId === myId ? this.setState({ thumbDown: true }) : null));
  }

  sendPointsToUser = (points, type, username) => {
    const { jwt } = this.props;
    const formBody = {};
    formBody.user_name = username;
    formBody[type] = points;
    serverApi.post('users/updatehighscore/', JSON.stringify(formBody), 'application/json', jwt[0])
      .catch(error => console.log(error));
  }

  setBikeToFound = () => {
    const {
      jwt, bikeId, navigation, refresh, bikeType, bikeSubUsername, username,
    } = this.props;
    const formBody = {
      id: bikeId,
      active: false,
	    type: 'FOUND',
    };
    serverApi.post('bikes/updatebike/', JSON.stringify(formBody), 'application/json', jwt[0])
      .then(
        this.sendPointsToUser(5, bikeScore, username),
        bikeType === 'FOUND' ? this.sendPointsToUser(5, bikeScore, bikeSubUsername) : null,
        refresh(),
        navigation.navigate('Profile'),

      );
  }

  handleFound = () => {
    Alert.alert(
      'Close Ad',
      'Are you sure you want to close your ad?',
      [
        { text: 'No', onPress: () => console.log('No'), style: 'cancel' },
        { text: 'Yes', onPress: () => { this.setBikeToFound(); console.log('Yes'); } },
      ],
      { cancelable: false },
    );
  }

  sendThumbRating = (value) => {
    const { commentId, jwt, refreshComments } = this.props;
    const formBody = {
      commentId,
      value,
    };

    serverApi.post('bikes/ratecomment/', JSON.stringify(formBody), 'application/json', jwt[0])
      .then(refreshComments())
      .catch(error => console.log(error));
  }


  handleThumbs = (action) => {
    const { thumbDown, thumbUp } = this.state;
    const { username } = this.props;
    switch (action) {
      case 'UP':
        this.sendThumbRating('up');
        if (!thumbUp) {
          this.sendPointsToUser(1, thumbScore, username);
        } else if (thumbUp) {
          this.sendPointsToUser(-1, thumbScore, username);
        }
        if (thumbDown) {
          this.sendThumbRating('down');
        }
        this.setState({ thumbUp: !thumbUp, thumbDown: false });
        break;
      case 'DW':
        if (!thumbDown && thumbUp) {
          this.sendThumbRating('up');
          this.sendPointsToUser(-1, thumbScore, username);
        }
        this.sendThumbRating('down');
        this.setState({ thumbDown: !thumbDown, thumbUp: false });
        break;
      default:
        break;
    }
  }

  handleLocation = () => {
    const { actions, navigation, location } = this.props;
    actions.setMarker({ latitude: location.lat, longitude: location.long });
    actions.setShowMarker(true);
    navigation.navigate('PinMap');
  }

  renderButtonSet = () => {
    const {
      showResolveBike, username, ownersComment, location,
    } = this.props;
    const { thumbDown, thumbUp } = this.state;

    let resolveButton = null;
    let positionButton = null;
    let thumbUpButton = null;
    let thumbDwButton = null;

    if (username !== '1' && location.lat && location.long) {
      positionButton = (
        <TouchableOpacity
          style={styles.locationTag}
          onPress={() => this.handleLocation()}
        >
          <Image
            style={styles.locationTag}
            source={locationIcon}
          />
        </TouchableOpacity>
      );
    }
    if (!ownersComment) {
      if (showResolveBike && username !== '1') {
        resolveButton = (
          <TouchableOpacity
            style={styles.FoundTag}
            onPress={() => this.handleFound()}
          >
            <Image
              style={styles.FoundTag}
              source={FoundBike}
            />
          </TouchableOpacity>
        );
      }
    }
    if (username !== '1') {
      thumbUpButton = (
        <TouchableOpacity
          disabled={ownersComment}
          style={styles.thumbDownTag}
          onPress={() => this.handleThumbs('DW')}
        >
          <Image
            style={[
              styles.thumbDownTag,
              thumbDown ? styles.setRed : [],
              ownersComment ? styles.ownCommentThumbs : [],
            ]}
            source={thumbDownIcon}
          />
        </TouchableOpacity>
      );
      thumbDwButton = (
        <TouchableOpacity
          disabled={ownersComment}
          style={styles.thumbUpTag}
          onPress={() => this.handleThumbs('UP')}
        >
          <Image
            style={[
              styles.thumbUpTag,
              thumbUp ? styles.setGreen : [],
              ownersComment ? styles.ownCommentThumbs : [],
            ]}
            source={thumbUpIcon}
          />
        </TouchableOpacity>
      );
    }
    return {
      resolveButton,
      positionButton,
      thumbUpButton,
      thumbDwButton,
    };
  }

  getThumbTotal = () => {
    const { rating, ownersComment } = this.props;
    const upPoints = rating.up.length;
    const downPoints = rating.down.length;
    const total = upPoints - downPoints;
    return (
      <Text style={[styles.totalThumbs, ownersComment ? styles.ownCommentTotal : []]}>
        {total}
      </Text>
    );
  }

  renderAnsShowReply = () => {
    const { answer, showReplys } = this.state;
    const { replyList } = this.props;
    return (
      <View style={styles.answer}>
        {!answer ? (
          <TouchableOpacity
            style={styles.separate}
            onPress={() => this.setState({ answer: true })}
          >
            <Text style={styles.answerText}>Answer</Text>
          </TouchableOpacity>) : null}
        {replyList.length ? (
          <TouchableOpacity
            style={styles.separate}
            onPress={() => this.setState({ showReplys: !showReplys })}
          >
            <Text style={styles.answerText}>Show replys</Text>
          </TouchableOpacity>
        ) : null}
      </View>);
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  };

  renderReplys = () => {
    const { replyList, renderComment } = this.props;
    return (
      <FlatList
        data={replyList}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={renderComment}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }

  renderSeparator = () => (
    <View
      style={{
        height: 1,
        width: '90%',
        backgroundColor: '#CED0CE',
        alignSelf: 'flex-end',
      }}
    />
  );

  render() {
    const {
      body, username, date, avatarUri, isReplyToCommentId, renderCommentField,
    } = this.props;
    const { answer, showReplys } = this.state;
    const dateRaw = date.split('-');
    let day = `${dateRaw[2]}`;
    day = day.split('T');
    const dateClean = `${day[0]}/${dateRaw[1]}`;
    const {
      resolveButton, positionButton, thumbUpButton, thumbDwButton,
    } = this.renderButtonSet();

    const thumbTotal = this.getThumbTotal();
    const answerField = this.renderAnsShowReply();
    const replys = this.renderReplys();
    return (
      <View style={isReplyToCommentId ? styles.commentWrapReply : styles.commentWrap}>
        <View style={styles.item}>
          <Image style={styles.image} source={avatarUri.length ? { uri: avatarUri } : userPlaceholder} />
          <View style={styles.textView}>
            <Text style={styles.userText}>
              {username}
              {''}
              {dateClean}
            </Text>
            <Text style={styles.description}>{body}</Text>
          </View>
          {isReplyToCommentId ? null : answerField}
          {positionButton}
          {thumbDwButton}
          {thumbTotal}
          {thumbUpButton}
          {resolveButton}
        </View>
        {answer ? renderCommentField(true, this) : null}
        {showReplys ? replys : null}
      </View>
    );
  }
}

Comment.propTypes = {
  body: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  jwt: PropTypes.arrayOf(PropTypes.string).isRequired,
  showResolveBike: PropTypes.bool.isRequired,
  bikeId: PropTypes.string.isRequired,
  avatarUri: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
  ownersComment: PropTypes.bool.isRequired,
  bikeSubUsername: PropTypes.string.isRequired,
  bikeType: PropTypes.string.isRequired,
  myId: PropTypes.string.isRequired,
  rating: PropTypes.shape({
    up: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    })).isRequired,
    down: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  commentId: PropTypes.string.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    long: PropTypes.number.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    setShowMarker: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
  }).isRequired,
  refreshComments: PropTypes.func.isRequired,
  renderCommentField: PropTypes.func.isRequired,
  replyList: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderComment: PropTypes.func.isRequired,
  isReplyToCommentId: PropTypes.bool.isRequired,
};
