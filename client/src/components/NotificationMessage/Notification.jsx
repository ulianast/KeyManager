import React from 'react';
import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
//import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// const styles = theme => ({
//   close: {
//     width: theme.spacing.unit * 4,
//     height: theme.spacing.unit * 4,
//   },
// });

class NotificationSnackbars extends React.PureComponent {
  state = {
    open: false,
    messageInfo: {},
  };

  queue = [];

  onNewMessageAdd = (message, timestamp) => {
    this.queue.push({
      message,
      key: timestamp ? timestamp : new Date().getTime()
      //key: new Date().getTime(),
    });

    if (this.state.open) {
      // immediately begin dismissing current message
      // to start showing new one
      this.setState({ open: false });
    } else {
      this.processQueue();
    }
  };

  processQueue = () => {
    if (this.queue.length > 0) {
      this.setState({
        messageInfo: this.queue.shift(),
        open: true,
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  handleExited = () => {
    this.processQueue();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.status && nextProps.status.message && 
        nextProps.status.timestamp && nextProps.status.timestamp !== this.state.messageInfo.key) {
      this.onNewMessageAdd(nextProps.status.message, nextProps.status.timestamp);
    }
  }

  render() {
    const { message, key } = this.state.messageInfo;

    return (
      <div>
        <Snackbar
          key={key}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onExited={this.handleExited}

          message={<span id="message-id">{message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

NotificationSnackbars.propTypes = {
  status: PropTypes.object,
};

export default NotificationSnackbars;