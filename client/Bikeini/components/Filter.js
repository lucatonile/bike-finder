import React from 'react';
import {
  StyleSheet, View, TouchableOpacity, Text, TextInput, Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as filterActions from '../navigation/actions/FilterActions';
import ItemCheckbox from './ItemCheckbox';

const styles = StyleSheet.create({
  fullContainter: {
    width: '100%',
    height: '65%',
    marginTop: '2%',
  },
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
  },
  searchBar: {
    flexDirection: 'row',
    height: '100%',
    width: '70%',
    marginBottom: '5%',
    borderWidth: 1,
  },
  filterButtons: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#44ccad',
  },
  filterButtonsText: {
    textAlignVertical: 'center',
    fontSize: 18,
    color: 'white',
  },

  inputs: {
    height: '7%',
    flex: 1,
    marginBottom: '5%',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
  },
  breakLine: {
    width: '100%',
    height: '1%',
    marginTop: '1%',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: 'red',
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    width: '50%',
    height: '100%',
    backgroundColor: 'white',
  },
});

class Filter extends React.Component {
  constructor(props) {
    super(props);

    const { filterState } = this.props;
    this.state = {
      checkBoxes: filterState.checkBoxes,
      categories: filterState.categories,
      searchOptions: filterState.searchOptions,
    };

    this.updateCheckBoxes = this.updateCheckBoxes.bind(this);
  }

  setSearchText(type, text) {
    const { searchOptions } = this.state;
    const { changeText } = this.props;
    searchOptions[type] = text;

    changeText(searchOptions);
  }

  search = () => {
    const { checkBoxes, categories, searchOptions } = this.state;
    const { search } = this.props;
    const {
      frameNumber, antiTheftCode, brand, model, color,
    } = searchOptions;
    const filterOptions = {};

    for (let i = 0; i < categories.length; i += 1) {
      const { items } = checkBoxes[i];
      for (let j = 0; j < items.length; j += 1) {
        if (items[j].isChecked) {
          if (items[j].data === 'male' || items[j].data === 'female') {
            filterOptions['keywords.frame_type'] = (items[j].data).toUpperCase();
          } else {
            filterOptions[`keywords.${items[j].data}`] = true;
          }
        }
      }
    }

    if (frameNumber !== '') {
      filterOptions.frame_number = frameNumber;
    }
    if (antiTheftCode !== '') {
      filterOptions.antitheft_code = antiTheftCode;
    }
    if (brand !== '') {
      filterOptions.brand = brand;
    }
    if (model !== '') {
      filterOptions.model = model;
    }
    if (color !== '') {
      filterOptions.color = color;
    }

    search(filterOptions);
  }

  reset = () => {
    const { resetItems, search, hideFilter } = this.props;
    resetItems(true);
    search({});
    hideFilter();
  }

  processFilterItems = (filterItems) => {
    let row = [];
    const processedFilter = [];
    let item1 = {};
    let item2 = {};
    const emptyItem = {
      category: '', id: -1, isChecked: false, title: '',
    };
    const categorySeperator = [emptyItem, emptyItem];

    for (let i = 0; i < filterItems.length; i += 1) {
      const { items, category } = filterItems[i];

      for (let j = 0; j < items.length; j += 2) {
        item1 = items[j];
        item1.category = category;
        item1.id = j;
        row.push(item1);

        if (j + 1 < items.length) {
          item2 = items[j + 1];
          item2.category = category;
          item2.id = j + 1;
          row.push(item2);
        } else {
          row.push(emptyItem);
        }

        processedFilter.push(row);
        row = [];
      }
      processedFilter.push(categorySeperator);
    }

    return processedFilter;
  }

  renderFilterOptions = () => {
    const { checkBoxes } = this.state;
    const processedFilter = this.processFilterItems(checkBoxes);
    const filterOptions = {};

    for (let i = 0; i < processedFilter.length; i += 1) {
      filterOptions.push(this.renderRow(processedFilter[i]));
    }

    return filterOptions;
  }

  updateCheckBoxes(id, category) {
    const { checkBoxes, categories } = this.state;
    const { changeItems } = this.props;

    const categoryInd = categories.indexOf(category);
    checkBoxes[categoryInd].items[id].isChecked = !checkBoxes[categoryInd].items[id].isChecked;

    changeItems(checkBoxes);
  }

  renderRow(rowData) {
    return (
      <View style={styles.rowContainer} key={Math.random() * 10000}>
        <View style={styles.itemContainer}>
          <ItemCheckbox title={rowData[0].title} category={rowData[0].category} id={rowData[0].id} isChecked={rowData[0].isChecked} onChange={this.updateCheckBoxes} />
        </View>
        <View style={styles.itemContainer}>
          <ItemCheckbox title={rowData[1].title} category={rowData[1].category} id={rowData[1].id} isChecked={rowData[1].isChecked} onChange={this.updateCheckBoxes} />
        </View>
      </View>
    );
  }

  render() {
    const { checkBoxes, searchOptions } = this.state;
    const processedFilter = this.processFilterItems(checkBoxes);
    return (
      <View style={styles.fullContainter}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          enableOnAndroid
          extraScrollHeight={100}
          enableAutoAutomaticScroll={(Platform.OS === 'ios')}
          innerRef={(ref) => { this.scroll = ref; }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: 10 }}>
            {processedFilter.map(rowData => this.renderRow(rowData))}
            <TextInput
              style={styles.inputs}
              placeholder="Frame number"
              value={searchOptions.frameNumber}
              onChangeText={text => this.setSearchText('frameNumber', text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Anti Theft Code"
              value={searchOptions.antiTheftCode}
              onChangeText={text => this.setSearchText('antiTheftCode', text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Brand"
              value={searchOptions.brand}
              onChangeText={text => this.setSearchText('brand', text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Model"
              value={searchOptions.model}
              onChangeText={text => this.setSearchText('model', text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Color"
              value={searchOptions.color}
              onChangeText={text => this.setSearchText('color', text)}
            />
            <View style={{
              flexDirection: 'row', marginTop: '5%', justifyContent: 'space-between',
            }}
            >
              <TouchableOpacity
                style={styles.filterButtons}
                onPress={this.reset}
              >
                <Text style={styles.filterButtonsText}>RESET</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterButtons}
                onPress={this.search}
              >
                <Text style={styles.filterButtonsText}>SEARCH</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.breakLine} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { filterState } = state;
  return { filterState };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators(
    { ...filterActions },
    dispatch,
  )
);

Filter.propTypes = {
  search: PropTypes.func.isRequired,
  hideFilter: PropTypes.func.isRequired,
  filterState: PropTypes.shape({
    checkBoxes: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
  }).isRequired,
  changeText: PropTypes.func.isRequired,
  resetItems: PropTypes.func.isRequired,
  changeItems: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
