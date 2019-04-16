import React from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput, Alert, TouchableHighlight,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import DialogInput from 'react-native-dialog-input';
import RF from 'react-native-responsive-fontsize';
import serverApi from '../utilities/serverApi';
import * as jwtActions from '../navigation/actions/JwtActions';
import * as mapActions from '../navigation/actions/MapActions';
import Item from '../components/Item';
import Comment from '../components/Comment';
import { bikeScore } from '../utilities/Const';
import { headerBackStyle } from './header';


const locationIcon = require('../assets/images/location.png');
const stockBicycle = require('../assets/images/stockBicycle.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  imageContainer: {
    alignSelf: 'center',
    width: '100%',
    flex: 0.5,
    marginTop: 5,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  descriptionContainer: {
    flex: 0.55,
    marginLeft: 10,
    flexDirection: 'row',
    width: '95%',
  },
  descriptionContainerHidden: {
    flex: 0,
    marginLeft: 10,
    flexDirection: 'row',
    width: '95%',
  },
  colFlex: {
    flexDirection: 'column',
    flex: 1,
  },
  rowFlex: {
    flexDirection: 'row',
  },
  headContainer: {
    alignItems: 'flex-start',
    marginTop: 1,
    marginBottom: 1,
  },
  head: {
    fontSize: RF(3.0),
    fontWeight: 'bold',
    width: '100%',
  },
  body: {
    fontSize: RF(2.1),
    alignSelf: 'flex-start',
  },

  listContainer: {
    flex: 1,
    marginTop: 5,
    width: '95%',
  },
  commentContainer: {
    flex: 1.2,
    width: '95%',
  },
  breakLine: {
    width: '100%',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  commentInputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'center',
    height: 40,
    width: '90%',
    borderWidth: 1,
    marginBottom: 15,
    paddingRight: 1,
  },
  replyInputContainer: {
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 40,
    width: '95%',
    borderWidth: 1,
    paddingRight: 2,
  },
  send: {
    alignSelf: 'center',
  },
  sendText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '300',
  },
  commentInput: {
    flex: 1,
    height: '100%',
    marginLeft: '2%',
  },
  closeButton: {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  found: {
    height: 25,
    // ios
    shadowOpacity: 0.6,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    // android
    elevation: 5,
  },
  buttonSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: '5%',
  },
  buttonCorner: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    height: '100%',
    borderWidth: 0.5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  buttonStart: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    height: '100%',
    borderWidth: 0.5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  greenButton: {
    backgroundColor: '#44ccad',
  },
  greenButtonText: {
    color: 'white',
    margin: 5,
  },
  matchAndComText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  locationTag: {
    width: 20,
    height: 20,
  },
  locationTagComment: {
    justifyContent: 'flex-end',
    width: 25,
    height: '90%',
  },
});


class BikeInformation extends React.Component {
  static navigationOptions = {
    ...headerBackStyle,
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const { state } = navigation;
    const { params } = state;
    const { bikeData, refresh } = params;

    this.state = {
      comments: [{
        body: 'No comments yet! Be the first to make a comment! :)', author: { username: '1', avatar_url: '' }, date: '1', _id: '1', rating: { down: [], up: [] },
      }],
      replys: [],
      matchingBikes: [],
      text: '',
      bikeData,
      refresh,
      isFetching: false,
      isDialogVisible: false,
      keyBoardVisible: false,
    };

    this.editCommentId = 0;
  }

  componentDidMount() {
    const { bikeData } = this.state;
    if (bikeData.showComments) {
      this.fetchComments();
    } else {
      this.fetchSimilarBikes();
    }
  }

  fetchSimilarBikes = () => {
    const { bikeData } = this.state;
    const { authState } = this.props;
    const { jwt } = authState;

    const formBody = this.jsonToFormData(bikeData);

    serverApi.post('bikes/getmatchingbikes', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        if (responseJson.length > 0) {
          responseJson.reverse();
          this.setState({ matchingBikes: responseJson });
        }
      }).catch(error => console.log(error));
  }

  fetchComments = () => {
    const { bikeData } = this.state;
    const { authState } = this.props;
    const { _id } = bikeData;
    const { jwt } = authState;

    const bikeInformation = {
      bikeId: _id,
    };

    const formBody = this.jsonToFormData(bikeInformation);

    serverApi.post('bikes/getcomments', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then((responseJson) => {
        if (responseJson.length > 0) {
          responseJson.reverse();
          const comments = [];
          const replys = [];
          Object.keys(responseJson).forEach((key) => {
            if (responseJson[key].isReplyToCommentId) {
              replys.push(responseJson[key]);
            } else {
              comments.push(responseJson[key]);
            }
          });
          this.setState({ comments, replys });
        }
        this.setState({ isFetching: false });
      }).catch(error => console.log(error));
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  };

  renderItem = ({ item }) => {
    let {
      bikeData,
    } = this.state;
    const bikeId = bikeData._id;
    const { refresh, replys } = this.state;
    const {
      authState, navigation, profileState, setMarker, setShowMarker,
    } = this.props;

    if (bikeData.showComments) {
      const {
        author,
      } = item;
      const avatarUri = author.avatar_url ? author.avatar_url.thumbnail : null;
      const { _id } = item;
      const { jwt } = authState;
      const ownersComment = profileState.username === item.author.username;
      bikeData.showResolveBike = bikeData.submitter.username !== item.author.username && bikeData.type === 'FOUND';

      const replyList = [];
      Object.keys(replys).forEach((key) => {
        if (replys[key].isReplyToCommentId === _id) replyList.push(replys[key]);
      });

      return (
        <TouchableOpacity
          onLongPress={() => {
            if (author._id === profileState.id) {
              this.editCommentId = _id;
              Alert.alert(
                'Edit/remove comment',
                'What action do you want to do? :]',
                [
                  {
                    text: 'Edit',
                    onPress: () => this.setState({ isDialogVisible: true },
                      () => {
                      // this.editCommentId = item._id;
                      }),
                  },
                  { text: 'Remove', onPress: () => { this.removeComment(); } },
                  { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                ],
                { cancelable: false },
              );
            }
          }}
        >
          <Comment
            actions={{ setShowMarker, setMarker }}
            body={item.body}
            commentId={_id}
            rating={item.rating}
            date={item.date}
            location={item.location || { lat: 0, long: 0 }}
            bikeSubUsername={bikeData.submitter.username || ''}
            bikeType={bikeData.type}
            showResolveBike={bikeData.showResolveBike}
            bikeId={bikeId}
            avatarUri={avatarUri || ''}
            myId={profileState.id}
            username={author.username}
            jwt={jwt}
            navigation={navigation}
            refresh={refresh}
            refreshComments={this.onRefresh}
            ownersComment={ownersComment}
            renderCommentField={this.renderCommentField}
            replyList={replyList}
            renderComment={this.renderItem}
            isReplyToCommentId={!!item.isReplyToCommentId || false}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => {
          bikeData = item;
          bikeData.showComments = true;
          bikeData.showResolveBike = profileState.username === bikeData.submitter.username;
          this.setState({ bikeData }, () => {
            this.fetchComments();
          });
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
          refresh={refresh}
          authState={authState}
          matchingBikesCount={false}
        />
      </TouchableOpacity>
    );
  }

  onRefresh = () => {
    this.setState({ isFetching: true }, () => {
      this.fetchComments();
    });
  }

  renderList = () => {
    const {
      comments, bikeData, isFetching, matchingBikes,
    } = this.state;
    const matchingBikesFiltered = matchingBikes.filter(x => x.active === true);


    if (bikeData.showComments) {
      return (
        <View style={styles.listContainer}>
          <View style={styles.breakLine}>
            <Text style={styles.matchAndComText}> COMMENTS </Text>
          </View>
          <FlatList
            data={comments}
            extraData={this.state}
            onRefresh={this.onRefresh}
            refreshing={isFetching}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
      );
    }


    return (
      <View style={styles.listContainer}>
        <View style={styles.breakLine}>
          <Text style={styles.matchAndComText}> MATCHING BIKES </Text>
        </View>
        <FlatList
          data={matchingBikesFiltered}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }

  jsonToFormData = (details) => {
    const formBody = Object.entries(details).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    return formBody;
  }

  sendComment = (reply, comment) => {
    const { text, bikeData } = this.state;
    const { _id } = bikeData;
    const {
      authState, profileState, mapState, cleanMapState,
    } = this.props;
    const { username } = profileState;
    const { jwt } = authState;

    const commentInformation = {
      username,
      bikeId: _id,
      body: reply ? comment.state.replyText : text,
      lat: mapState.userMarker.userMarkerSet ? mapState.userMarker.latitude : null,
      long: mapState.userMarker.userMarkerSet ? mapState.userMarker.longitude : null,
    };
    if (reply) commentInformation.replyCommentId = comment.props.commentId;
    if ((!reply && text === '') || (reply && comment.state.replyText === '')) {
      Alert.alert('You must add some text :0 !');
      return;
    }
    const formBody = this.jsonToFormData(commentInformation);
    serverApi.post('bikes/addcomment', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then(() => {
        if (reply) {
          comment.setState({ replyText: '', answer: false }, () => {
            cleanMapState();
            this.fetchComments();
          });
        } else {
          this.setState({ text: '' }, () => {
            cleanMapState();
            this.fetchComments();
          });
        }
      }).catch(error => console.log(error));
  }

  renderCommentField = (reply, comment) => {
    const { text, bikeData } = this.state;
    const { navigation } = this.props;
    if (bikeData.showComments) {
      const cancelButton = reply ? (
        <View style={[styles.send, styles.buttonStart, styles.greenButton]}>
          <TouchableOpacity
            onPress={() => comment.setState({ answer: false })}
          >
            <Text style={styles.sendText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null;
      return (
        <View style={reply ? styles.replyInputContainer : styles.commentInputContainer}>
          {cancelButton}
          <TouchableOpacity
            style={[styles.locationTagComment, styles.send]}
            onPress={() => navigation.navigate('PinMap')}
          >
            <Image
              style={styles.locationTagComment}
              source={locationIcon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.commentInput}
            onChangeText={(newText) => {
              if (reply) {
                comment.setState({ replyText: newText });
              } else {
                this.setState({ text: newText });
              }
            }}
            value={reply ? comment.state.replyText : text}
            placeholder="Add comment..."
          />
          <View style={[styles.send, styles.buttonCorner, styles.greenButton]}>
            <TouchableOpacity
              onPress={() => {
                this.sendComment(reply, comment);
              }}
            >
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }


    return null;
  }

  renderFoundButton = () => {
    const { bikeData } = this.state;
    const { profileState } = this.props;
    // TODO: change to submitter.username, when backend fixes submitter
    const bikeSubmitter = bikeData.submitter.username || bikeData.submitter;
    if (bikeSubmitter === profileState.username || bikeData.type === 'FOUND') {
      return (
        <View style={styles.closeButton}>
          <TouchableHighlight style={[styles.buttonSmall, styles.greenButton, styles.found]} onPress={() => this.handleFound()}>
            <Text style={styles.greenButtonText}>BIKE IS FOUND</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return null;
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

  setBikeToFound = () => {
    const { authState, navigation, profileState } = this.props;
    const { bikeData, refresh } = this.state;
    const { _id } = bikeData;
    // TODO change to userName when backend fixes submitter to username
    const bikeSubmitter = bikeData.submitter.username || bikeData.submitter;
    const formBody = {
      id: _id,
      active: false,
	    type: 'FOUND',
    };
    serverApi.post('bikes/updatebike/', JSON.stringify(formBody), 'application/json', authState.jwt[0])
      .then(
        refresh(),
        // TODO change to userName when backend fixes submitter to username
        bikeData.type === 'FOUND' && profileState.id !== bikeSubmitter ? this.sendPointsToUser(5, bikeScore) : null,
        navigation.navigate('Browser'),
      );
  }

  sendPointsToUser = (points, type) => {
    const { authState } = this.props;
    const { bikeData } = this.state;
    // TODO: change to submitter.username, when backend fixes submitter
    const bikeSubmitter = bikeData.submitter.username || bikeData.submitter;
    const formBody = { username: bikeSubmitter };
    formBody[type] = points;
    serverApi.post('users/updatehighscore/', JSON.stringify(formBody), 'application/json', authState.jwt[0])
      .catch(error => console.log(error));
  }


  handleLocation = () => {
    const { bikeData } = this.state;
    const { setMarker, setShowMarker, navigation } = this.props;
    setMarker({ latitude: bikeData.location.lat, longitude: bikeData.location.long });
    setShowMarker(true);
    navigation.navigate('PinMap');
  }

  changeCommentText = (text) => {
    const { bikeData } = this.state;
    const { authState } = this.props;
    const { _id } = bikeData;
    const { jwt } = authState;

    const body = { bikeId: _id, commentId: this.editCommentId, body: text };
    const formBody = this.jsonToFormData(body);
    serverApi.post('bikes/editcomment', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then(() => {
        this.setState({ isDialogVisible: false }, () => {
          this.fetchComments();
        });
      }).catch((error) => {
        console.log(error);
        this.setState({ isDialogVisible: false });
      });
  }

  removeComment = () => {
    const { bikeData } = this.state;
    const { authState } = this.props;
    const { _id } = bikeData;
    const { jwt } = authState;

    const body = { bikeId: _id, commentId: this.editCommentId };
    const formBody = this.jsonToFormData(body);

    serverApi.post('bikes/removecomment', formBody, 'application/x-www-form-urlencoded', jwt[0])
      .then(() => {
        this.fetchComments();
      }).catch((error) => {
        console.log(error);
      });
  }

  handleKeyboard = (keyboardState, keyboardSpace) => {
    this.setState({ keyBoardVisible: keyboardState });
  }

  render() {
    const { bikeData, isDialogVisible, keyBoardVisible } = this.state;
    const {
      title, location, description, brand, color, frameNumber, model,
    } = bikeData;
    const city = location ? location.city : '';
    const neighborhood = location ? location.neighborhood : '';
    const comma = (brand || model) ? ', ' : '';
    const newLine = (brand || model) ? ' ' : '';

    const list = this.renderList();
    const commentField = this.renderCommentField(false);
    const foundButton = this.renderFoundButton();
    const imgSource = bikeData.image_url ? { uri: bikeData.image_url.img } : stockBicycle;

    let positionButton = null;
    if (location.lat && location.long) {
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
    return (
      <View style={styles.container}>
        <DialogInput
          isDialogVisible={isDialogVisible}
          title="Edit comment"
          hintInput="New comment..."
          submitInput={(inputText) => { this.changeCommentText(inputText); }}
          closeDialog={() => { this.setState({ isDialogVisible: false }); }}
        />
        <View style={styles.imageContainer}>
          <Image style={styles.image} resizeMode="contain" resizeMethod="scale" source={imgSource} />
        </View>
        {!keyBoardVisible
          ? (
            <View style={styles.descriptionContainer}>
              <View style={styles.colFlex}>
                <View style={[styles.headContainer, styles.rowFlex]}>
                  <Text style={styles.head} adjustsFontSizeToFit>{title}</Text>
                </View>
                <View style={styles.rowFlex}>
                  <Text style={styles.body} adjustsFontSizeToFit>
                    {city}
                    {', '}
                    {neighborhood}
                  </Text>
                  {positionButton}
                </View>
                <Text
                  style={styles.body}
                  adjustsFontSizeToFit
                >
                  {description}
                </Text>
                <Text style={styles.body} adjustsFontSizeToFit>
                  {brand}
                  {newLine}
                  {model}
                  {comma}
                  {color}
                </Text>
                <Text style={styles.body} adjustsFontSizeToFit>
              Frame number:
                  {' '}
                  {frameNumber}
                </Text>
                {foundButton}
              </View>
            </View>
          )
          : null}
        <View style={styles.commentContainer}>
          {list}
        </View>
        {commentField}
        <KeyboardSpacer onToggle={this.handleKeyboard} />
      </View>
    );
  }
}

BikeInformation.propTypes = {
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
    id: PropTypes.string.isRequired,
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
  mapState: PropTypes.shape({
    userMarker: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      userMarkerSet: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  cleanMapState: PropTypes.func.isRequired,
  setMarker: PropTypes.func.isRequired,
  setShowMarker: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { profileState, authState, mapState } = state;
  return { profileState, authState, mapState };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...jwtActions, ...mapActions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(BikeInformation);
