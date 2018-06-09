import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import './UserProfile.css';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import {default as UserIcon} from '@material-ui/icons/PermIdentity';
import TabHeader from '../../../components/TabHeader/TabHeader';

const UserProfile = ({
  user
}) => (
  <Paper className = "profile-main">
    <TabHeader tabText="Профиль"/>
    <div className="account-inf-block">
      <div className="field-item">
        <p className="field-item-val">{user ? user.fullName : ''}</p>
        <p className="field-item-label">ФИО</p>
      </div>

      <div className="field-item">
        <p className="field-item-val">{user ? user.login : ''}</p>
        <p className="field-item-label">Логин</p>
      </div>

      <div className="field-item">
        <p className="field-item-val">{user ? user.status : ''}</p>
        <p className="field-item-label">Статус</p>
      </div>

      <div className="field-item">
        <p className="field-item-val">{user ? user.shops : ''}</p>
        <p className="field-item-label">Адресс магазина</p>
      </div>
    </div>
    
  </Paper>
);

UserProfile.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserProfile;