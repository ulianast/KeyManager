import React from 'react';
import PropTypes from 'prop-types';
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List';
// import SelectableList from '../../components/SelectableList';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import {default as TableIcon} from '@material-ui/icons/Dns';
import {default as UserIcon} from '@material-ui/icons/PermIdentity';
import {default as UsersTableIcon} from '@material-ui/icons/SupervisorAccount';
import {default as NewUserIcon} from '@material-ui/icons/PersonAdd';
import {default as AddSvgIcon} from '@material-ui/icons/Description';
import {default as ServicesIcon} from '@material-ui/icons/Queue';
import {default as SellersStatisticsIcon} from '@material-ui/icons/TrendingUp';
import { PROFILE_TAB, ACTIVATION_TABLE, NEW_USER, USER_TABLE, ADD_SVG, SERVICES, SELLER_STAT } from '../constants';
import grey from 'material-ui/colors/grey';
import { withStyles } from 'material-ui/styles';

import './styles.css';

const styles = {
  dividerRoot: {
    color: grey[800]
  }
};


class UserNavMenuContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedItem: this.props.defaultValue,
      items : [
        // {
        //   text: "Профиль",
        //   value: PROFILE_TAB,
        //   icon: <UserIcon/>
        // },
        {
          text: "Таблица активаций",
          value: ACTIVATION_TABLE,
          icon: <TableIcon/>
        },
        {
          text: "Таблица пользователей",
          value: USER_TABLE,
          icon: <UsersTableIcon/>
        },
        {
          text: "Общая статистика консультантов",
          value: SELLER_STAT,
          icon: <SellersStatisticsIcon/>
        },
        {
          text: "Добавить пользователя",
          value: NEW_USER,
          icon: <NewUserIcon/>
        },
        {
          text: "Лицензионные коды",
          value: ADD_SVG,
          icon: <AddSvgIcon/>
        },
        {
          text: "Сервисные пакеты",
          value: SERVICES,
          icon: <ServicesIcon/>
        }
      ]
    };
  }
  

  render() {
    return(
      <List className="left-nav-menu">
        {this.state.items.map((item, index) =>
          <div key={index}>
            <ListItem 
              button      
              value={item.value} 
              onClick={() => this.props.onItemChosen(item.value)}                 
            >
              <ListItemIcon color="secondary">
                {item.icon}
              </ListItemIcon>
              <ListItemText disableTypography primary={
                <Typography  color="secondary">
                  {item.text}
                </Typography>
              } />
            </ListItem>
            <Divider classes={{root: this.props.classes.dividerRoot}}/>
          </div>
        )}
      </List>
    );
  }
}

UserNavMenuContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultValue: PropTypes.string.isRequired,
  onItemChosen: PropTypes.func.isRequired
};

export default withStyles(styles)(UserNavMenuContainer);