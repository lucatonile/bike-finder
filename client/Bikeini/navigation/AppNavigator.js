import { createStackNavigator } from 'react-navigation';
import TabNavigator from './BottomNavigator';
import Login from '../screens/Login';
import TempPage from '../screens/TempPage';
import SignUp from '../screens/SignUp';
import ResetPassword from '../screens/ResetPassword';
import Camera from '../screens/Camera';
import Location from '../screens/Location';
import BikeInformation from '../screens/BikeInformation';
import PinMap from '../screens/PinMap';
import EditProfile from '../screens/EditProfile';

import { headerStyle } from '../screens/header';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  TempPage: { screen: TempPage },
  SignUp: { screen: SignUp },
  ResetPassword: { screen: ResetPassword },
  Camera: { screen: Camera },
  Location: {
    screen: Location,
    navigationOptions: {
      headerLeft: null,
      gesturesEnabled: false,
    },
  },
  BikeInformation: { screen: BikeInformation },
  PinMap: {
    screen: PinMap,
    navigationOptions: {
      headerLeft: null,
      gesturesEnabled: false,
    },
  },
  EditProfile: { screen: EditProfile },
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: {
      ...headerStyle,
      gesturesEnabled: false,
    },
  },
},
{
  initialRouteName: 'Login',
});

export default AppNavigator;
