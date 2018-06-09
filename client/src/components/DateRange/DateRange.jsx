import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/ru';
import { DateRange } from 'react-date-range';
import { format, addDays } from 'date-fns';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import './styles.css';

const TODAY = 'TODAY',
      WEEK = 'WEEK',
      MONTH = 'MONTH',
      ALL = 'ALL',
      CUSTOM = 'CUSTOM';

function formatDateDisplay(date, defaultText) {
  if (!date) return defaultText;
  return format(date, 'DD/MM/YYYY');
}

class DateRangeComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      startDate: null,
      endDate: moment(),
      activeDateRange: ALL,
      isDatePickerOpen: false
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChipClick = this.handleChipClick.bind(this);
    this.handlePickerClose = this.handlePickerClose.bind(this);
  }

  handleSelect(range) {
    this.setState({
      startDate: range.startDate,
      endDate: range.endDate,
      // isDatePickerOpen: range.startDate == range.endDate
    });
  }

  handlePickerClose() {
    this.setState({
      isDatePickerOpen: false
    })

    this.props.onRangeSet(this.state.startDate, this.state.endDate);
  }

  handleChipClick(type) {
    let endDate = moment(),
        startDate = null,
        isDatePickerOpen = false;

    switch(type) {
      case TODAY:
        startDate = moment().startOf('day');
        break;
      case WEEK:
        startDate = moment().startOf('week');
        break;
      case MONTH:
        startDate = moment().startOf('month');
        break;
      case CUSTOM:
        startDate = moment();
        isDatePickerOpen = true;
        break;
    }

    this.setState({
      activeDateRange: type,
      startDate: startDate,
      endDate: endDate,
      isDatePickerOpen: isDatePickerOpen
    });

    if (type !== CUSTOM) {
      this.props.onRangeSet(startDate, endDate);
    }
  }

  render() {
    const { activeDateRange, startDate, endDate, isDatePickerOpen } = this.state;

    return (
      <div className="active-container">
        <div className="date-select-container">
          <span className="active-date-container">
            <span>Активации за: </span>
            <span> {formatDateDisplay(startDate, `   ...    `)} </span> -
            <span> {formatDateDisplay(endDate)} </span>
          </span>
          <span className="chip-container">
            <Chip
              tabIndex={-1}
              label="Сегодня"
              onClick={() => this.handleChipClick(TODAY)}
              className={activeDateRange === TODAY ? 'selected date-select-chip' : 'date-select-chip'}
            />
            <Chip
              tabIndex={-1}
              label="Текущая неделя"
              onClick={() => this.handleChipClick(WEEK)}
              className={activeDateRange === WEEK ? 'selected date-select-chip' : 'date-select-chip'}
            />
            <Chip
              tabIndex={-1}
              label="Текущий месяц"
              onClick={() => this.handleChipClick(MONTH)}
              className={activeDateRange === MONTH ? 'selected date-select-chip' : 'date-select-chip'}
            />
            <Chip
              tabIndex={-1}
              label="Выбор даты"
              onClick={() => this.handleChipClick(CUSTOM)}
              className={activeDateRange === CUSTOM ? 'selected date-select-chip' : 'date-select-chip'}
            />
            <Chip
              tabIndex={-1}
              label="За все время"
              onClick={() => this.handleChipClick(ALL)}
              className={activeDateRange === ALL ? 'selected date-select-chip' : 'date-select-chip'}
            />
          </span>
        </div>

        <Paper className="date-picker-absolute">        
            {isDatePickerOpen && 
              <div className="date-picker-container">
                <DateRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={this.handleSelect}
                />
                <Chip
                  tabIndex={-1}
                  label="Закрыть"
                  onClick={this.handlePickerClose}
                  className="selected date-select-chip"
                />
              </div>

          }
        </Paper>      
        
        

      </div>
    )
  }
}

DateRangeComponent.propTypes = {
  onRangeSet: PropTypes.func.isRequired
}

export default DateRangeComponent;