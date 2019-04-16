import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

export default class ItemCheckbox extends React.Component {
  constructor(props) {
    super(props);

    const {
      title, id, isChecked, category,
    } = this.props;
    this.state = {
      isChecked,
      title,
      id,
      category,
    };
  }

  changeStatus = () => {
    const {
      id, category, isChecked,
    } = this.state;
    const { onChange } = this.props;
    this.setState({ isChecked: !isChecked }, () => {
      onChange(id, category);
    });
  }

  render() {
    const { title, isChecked } = this.state;
    if (title !== '') {
      return (
        <CheckBox
          title={title}
          checked={isChecked}
          containerStyle={{
            padding: 0,
            backgroundColor: 'white',
            borderWidth: 0,
          }}
          onPress={this.changeStatus}
        />
      );
    }


    return <View style={styles.emptyContainer} />;
  }
}

ItemCheckbox.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  isChecked: PropTypes.bool.isRequired,
  category: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
