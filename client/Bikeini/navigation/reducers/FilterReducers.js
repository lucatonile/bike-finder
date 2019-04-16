import { CHANGEITEMS, RESETITEMS, CHANGETEXT } from '../actions/types';

const ITEMS_STATE = {
  checkBoxes: [
    {
      category: 'Type',
      items:
        [{ title: 'Female bike', data: 'female', isChecked: false },
          { title: 'Male bike', data: 'male', isChecked: false },
          { title: 'Kids bike', data: 'child', isChecked: false },
          { title: 'Sports bike', data: 'sport', isChecked: false },
          { title: 'Tandem bike', data: 'tandem', isChecked: false }],
    },
    {
      category: 'Other',
      items:
         [{ title: 'Basket', data: 'basket', isChecked: false },
           { title: 'Mudguard', data: 'mudguard', isChecked: false },
           { title: 'Chain protection', data: 'chain_protection', isChecked: false },
           { title: 'Net', data: 'net', isChecked: false },
           { title: 'Winter tires', data: 'winter_tires', isChecked: false },
           { title: 'Lamp', data: 'light', isChecked: false }],
    },
  ],
  categories: ['Type', 'Other'],
  searchOptions: {
    frameNumber: '',
    antiTheftCode: '',
    brand: '',
    model: '',
    color: '',
  },
};

const filterReducer = (state = ITEMS_STATE, action) => {
  switch (action.type) {
    case CHANGEITEMS:
      return {
        ...state, checkBoxes: action.payload,
      };
    case CHANGETEXT:
      return {
        ...state, searchOptions: action.payload,
      };
    case RESETITEMS:
      return {
        checkBoxes: [
          {
            category: 'Type',
            items:
        [{ title: 'Female bike', data: 'female', isChecked: false },
          { title: 'Male bike', data: 'male', isChecked: false },
          { title: 'Kids bike', data: 'child', isChecked: false },
          { title: 'Sports bike', data: 'sport', isChecked: false },
          { title: 'Tandem bike', data: 'tandem', isChecked: false }],
          },
          {
            category: 'Other',
            items:
         [{ title: 'Basket', data: 'basket', isChecked: false },
           { title: 'Mudguard', data: 'mudguard', isChecked: false },
           { title: 'Chain protection', data: 'chain_protection', isChecked: false },
           { title: 'Net', data: 'net', isChecked: false },
           { title: 'Winter tires', data: 'winter_tires', isChecked: false },
           { title: 'Lamp', data: 'light', isChecked: false }],
          },
        ],
        categories: ['Type', 'Other'],
        searchOptions: {
          frameNumber: '',
          antiTheftCode: '',
          brand: '',
          model: '',
          color: '',
        },
      };
    default:
      return state;
  }
};

export default filterReducer;
