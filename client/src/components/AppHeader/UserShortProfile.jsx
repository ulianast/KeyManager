import React from 'react';
import PropTypes from 'prop-types';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem, MenuList } from 'material-ui/Menu';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Collapse from 'material-ui/transitions/Collapse';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import Portal from 'material-ui/Portal';
import Button from 'material-ui/Button';
import auth from '../../utils/auth';
import './styles.css';

class UserShortProfile extends React.PureComponent {
  
  constructor(props) {
    super(props);
    const shop = auth.getShop();

    this.state = {
      anchorEl: null,
      shop: (shop && shop.address) ? shop.address : ''
    }
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { onUserLogout, user } = this.props;
    const { anchorEl, shop } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className="user-profile">
        <Manager>
          <Target>
            <div
              ref={node => {
                this.target1 = node;
              }}
            >
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Target>
          {open && 
          <Popper
            placement="bottom-end"
            eventsEnabled={open}
            className="popper-appbar"
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow in={open} id="menu-appbar" style={{ transformOrigin: '0 0 0' }} className="menu-appbar">
                <Paper>
                  <MenuList role="menu">
                    <MenuItem className="field-item-container">
                      <p className="field-item-label">ФИО</p>
                      <p className="field-item-value">{user ? user.fullName : ''}</p> 
                    </MenuItem>
                    <MenuItem className="field-item-container">
                      <p className="field-item-label">Логин</p>
                      <p className="field-item-value">{user ? user.login : ''}</p>
                    </MenuItem>
                    <MenuItem className="field-item-container">
                      <p className="field-item-label">Статус</p>
                      <p className="field-item-value">{user ? user.status : ''}</p>
                    </MenuItem>
                    <MenuItem className="field-item-container">
                      <p className="field-item-label">Адресс магазина</p>
                      <p className="field-item-value">{shop}</p>
                    </MenuItem>
                    <MenuItem>
                      <Button color="primary" variant="raised" onClick={() => onUserLogout()}>Выйти</Button>
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            
            </ClickAwayListener>
          </Popper>
          }
        </Manager>
      </div>
    )
  }
}

UserShortProfile.propTypes = {
  onUserLogout: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default UserShortProfile;