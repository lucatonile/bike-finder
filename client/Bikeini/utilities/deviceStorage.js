import { AsyncStorage } from 'react-native';
import { login } from '../navigation/actions/AuthActions';

// Guide I used for creating the React-Native <-> NodeJs communication.
// https://medium.com/@njwest/building-a-react-native-jwt-client-api-requests-and-asyncstorage-d1a20ab60cf4


const deviceStorage = {
  async saveItem(key, value) {
	    try {
	      await AsyncStorage.setItem(key, value);
	    } catch (error) {
	      console.log(`AsyncStorage Error: ${error.message}`);
	    }
  },

  async loadJWT() {
	    try {
	      const value = await AsyncStorage.getItem('id_token');
	      if (value !== null) {
        console.log('found:', value);
        login(value);
	        this.setState({
	          jwt: [value, ''],
	          loading: false,
        });
	      } else {
	        this.setState({
	          loading: false,
	        });
      }
	    } catch (error) {
	      console.log(`AsyncStorage Error: ${error.message}`);
	    }
  },

  async deleteJWT() {
	    try {
	      await AsyncStorage.removeItem('id_token')
	      .then(
	        () => {
	          this.setState({
	            jwt: '',
	          });
	        },
	      );
	    } catch (error) {
	      console.log(`AsyncStorage Error: ${error.message}`);
	    }
  },
};

export default deviceStorage;
