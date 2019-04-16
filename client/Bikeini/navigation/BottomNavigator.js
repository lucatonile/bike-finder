import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import FooterIcon from '../components/FooterIcon';

import TabBarIcon from '../assets/TabBarIcon';
import Browser from '../screens/Browser';
import AddBike from '../screens/AddBike';
import Profile from '../screens/Profile';
import Gamification from '../screens/Gamification';

export default createBottomTabNavigator({
  Browser: {
    screen: Browser,
    navigationOptions: {
      title: 'Browser',
      header: null,
      tabBarLabel: 'Ads',
      tabBarOptions: {
        activeTintColor: '#44ccad',
      },
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={Platform.OS === 'ios' ? 'ios-bicycle' : 'md-bicycle'}
        />
      ),
    },
  },
  AddBike: {
    screen: AddBike,
    navigationOptions: {
      title: 'AddBike',
      header: null,
      tabBarLabel: 'New Ad',
      tabBarOptions: {
        activeTintColor: '#44ccad',
      },
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={Platform.OS === 'ios' ? 'ios-add-circle' : 'md-add-circle'}
        />
      ),
    },
  },
  Gamification: {
    screen: Gamification,
    navigationOptions: {
      title: '',
      header: null,
      tabBarLabel: 'Game',
      tabBarOptions: {
        activeTintColor: '#44ccad',
      },
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={Platform.OS === 'ios' ? 'ios-trophy' : 'md-trophy'}
        />
      ),
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: '',
      header: null,
      tabBarLabel: 'Profile',
      tabBarOptions: {
        activeTintColor: '#44ccad',
      },
      tabBarIcon: ({ focused }) => (
        <FooterIcon focused={focused} />
      ),
    },
  },
}, {

});
