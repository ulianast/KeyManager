import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import keycode from 'keycode';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';
import './styles.css';

function renderInput(inputProps) {
  const { InputProps, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex }) {
  const isHighlighted = highlightedIndex === index;

  return (
    <MenuItem
      {...itemProps}
      key={index}
      selected={isHighlighted}
      component="div"
    >
      {suggestion}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  suggestion: PropTypes.string.isRequired,
};

function getSuggestions(suggestions, inputValue) {
  let count = 0;
  const inputValLowercased = inputValue.toLowerCase();

  return (suggestions && _.isArray(suggestions)) ? 
    suggestions.filter(suggestion => {
      const keep =
        (!inputValue || suggestion.toLowerCase().indexOf(inputValLowercased) !== -1) &&
        count < 5;

      if (keep) {
        count += 1;
      }

      return keep;
    }) :
    [];
}

function buildSuggestions(data, columnId) {
  const suggestions = new Set();

  _.forEach(data, item => {
    
    if (item[columnId]) {
      suggestions.add(item[columnId]);
    }  
  });    

  return [...suggestions];
}

class FilterCell extends React.PureComponent {
  
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      selectedItem: '',
      suggestions: buildSuggestions(props.data, props.columnId),
    };
  }

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleChange = item => {
    const { columnId, onSelect } = this.props;
    this.setState({
      inputValue: '',
      selectedItem: item,
    });
    onSelect(columnId, item);
  };

  handleDelete = () => {
    const { columnId, onSelect } = this.props;
    this.setState({ selectedItem: '' });
    onSelect(columnId, '');
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      id: nextProps.columnId,
      suggestions: buildSuggestions(nextProps.data, nextProps.columnId)
    });
  }

  render() {
    const { inputValue, selectedItem, suggestions } = this.state;

    return (
      <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItem={selectedItem}>
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
        }) => (
          <div >
            {selectedItem ? 
              <Chip
                tabIndex={-1}
                className='filter-chip'
                label={selectedItem}                    
                onDelete={this.handleDelete}
              /> :
              renderInput({
                className: 'filter-input',
                InputProps: getInputProps({
                  placeholder: 'Фильтровать...',
                  onChange: this.handleInputChange,
                  onKeyDown: this.handleKeyDown,                 
                }),
              })
            }
            {isOpen ? 
              <Paper square elevation={4} className="table-dropdown-absolute">
                {getSuggestions(suggestions, inputValue).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                  }),
                )}
              </Paper> :
              null
            }
            
          </div>
        )}
      </Downshift>
    );
  }
}

FilterCell.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columnId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default FilterCell;