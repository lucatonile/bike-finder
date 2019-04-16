import React from 'react';
import {
  View,
} from 'react-native';

export const headerStyle = {
  title: 'Bikeini',
  headerLeft: null,
  headerTitleStyle: {
    fontFamily: 'CustomFont',
    fontSize: 26,
    fontWeight: '200',
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  headerTintColor: '#44ccad',
  headerStyle: {
    backgroundColor: '#fefefe',
  },
};

export const headerBackStyle = {
  title: 'Bikeini',
  headerRight: (<View />),
  headerTitleStyle: {
    fontFamily: 'CustomFont',
    fontSize: 26,
    fontWeight: '200',
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  headerTintColor: '#44ccad',
  headerStyle: {
    backgroundColor: '#fefefe',
  },
};
