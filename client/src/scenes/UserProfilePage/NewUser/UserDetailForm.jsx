import React from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
// import Select from 'react-select';
// import 'react-select/dist/react-select.css';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
// import { Card, CardText } from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
// import PhoneInput from './PhoneInput.jsx';
import Chip from 'material-ui/Chip';
import Input, { InputLabel } from 'material-ui/Input';
import { ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import { FormControl, FormHelperText } from 'material-ui/Form';
import ErrorStatus from '../../../components/ErrorStatus/ErrorStatus';
import Notifications from '../../../components/NotificationMessage/Notification';
import _ from 'lodash';
import './styles.css'

const styles = {
  formControl: {
    // margin: theme.spacing.unit,
    minWidth: 250,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    // margin: theme.spacing.unit / 4,
  },

};

const getShopLabel = (value, shopOptions) => {
  console.log(value);
  console.log(shopOptions);
  const index = _.findIndex(shopOptions, item => { return item.value === value; });
  //const index = shopOptions.indexOf(value);
  console.log(index);
  return index > -1 ? shopOptions[index].label : value;
}

const UserDetailForm = ({
  classes,
  onSubmit,
  onChange,
  onLoginInputEnd,
  //onPhoneInputEnd,
  onShopSelected,
  onRoleSelected,
  errors,
  statusMessage,
  user,
  shopsOptions,
  roleOptions
}) => (
    <div className="user-detail-form"> 
      <form action="/" onSubmit={onSubmit}>
        <ErrorStatus error={errors.summary}/>

        <div className="text-line">
          <FormControl className={classes.formControl}  aria-describedby="fullname">
            <InputLabel htmlFor="fullname">ФИО</InputLabel>
            <Input 
              id="fullname" 
              value={user.fullname} 
              onChange={onChange} 
              type="text" 
              name="fullname"
            />
            {errors.fullname && <FormHelperText className="" error id="fullname-error-text">{errors.fullname}</FormHelperText>}
          </FormControl>
        </div>

        <div className="text-line">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-role">Статус</InputLabel>
            <Select
              id="select-role"
              value={user.role}
              onChange={onChange}
              inputProps={{
                name: 'role',
                id: 'select-role',
              }}
            >
              {
                roleOptions.map(roleOption => (
                  <MenuItem
                    key={roleOption.value}                 
                    value={roleOption.value}
                  >
                    {roleOption.label}
                  </MenuItem>
                ))
              }
            </Select>
            {errors.role && <FormHelperText className="" error id="select-role-error-text">{errors.role}</FormHelperText>}
          </FormControl>      
        </div>

        <div className="text-line">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-shops">Торговая точка</InputLabel>
            <Select
              multiple
              id="select-shops"
              value={user.shops}
              onChange={onShopSelected}
              input={<Input id="select-shops" />}
              renderValue={selected => (
                  <div className={classes.chips}>
                    {selected.map(value => 
                      <Chip key={value} label={getShopLabel(value, shopsOptions)} className={classes.chip} />
                    )}
                  </div>
                )}
            >
              {
                shopsOptions.map(shopOption => (
                  <MenuItem
                    key={shopOption.value}
                    value={shopOption.value}
                  >
                    <Checkbox checked={user.shops && user.shops.indexOf(shopOption.value) > -1} color="primary"/>
                    <ListItemText primary={shopOption.label} />
                  </MenuItem>
                ))
              }
            </Select> 
            {errors.shops && <FormHelperText className="" error id="select-shops-error-text">{errors.shops}</FormHelperText>}
          </FormControl>       
        </div>

        <div className="text-line">
          <FormControl className={classes.formControl}  aria-describedby="username" onBlur={onLoginInputEnd}> 
            <InputLabel htmlFor="username">Логин</InputLabel>
            <Input 
              id="username" 
              value={user.username} 
              onChange={onChange} 
              type="text" 
              name="username"
            />
            {errors.username && <FormHelperText className="" error id="username-error-text">{errors.username}</FormHelperText>}
          </FormControl>
        </div>

        <div className="text-line">
          <FormControl className={classes.formControl}  aria-describedby="password">
            <InputLabel htmlFor="password">Пароль</InputLabel>
            <Input 
              id="password" 
              value={user.password} 
              onChange={onChange} 
              type="password" 
              name="password"
            />
            {errors.password && <FormHelperText className="" error id="password-error-text">{errors.password}</FormHelperText>}
          </FormControl>
        </div>

        <div className="text-line">
          <FormControl className={classes.formControl}  aria-describedby="repeatPassword">
            <InputLabel htmlFor="repeatPassword">Повторите пароль</InputLabel>
            <Input 
              id="repeatPassword" 
              value={user.repeatPassword} 
              onChange={onChange} 
              type="password" 
              name="repeatPassword"
            />
            {errors.repeatPassword && <FormHelperText error id="repeatPassword-error-text">{errors.repeatPassword}</FormHelperText>}
          </FormControl>

 
        </div>

        <div className="button-line">
          <Button variant="raised" type="submit" color="primary">
            Создать новый аккаунт
          </Button>
        </div>
      </form>
      <Notifications status={statusMessage}/>
    </div>
);

UserDetailForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onLoginInputEnd: PropTypes.func.isRequired,
  //onPhoneInputEnd: PropTypes.func.isRequired,
  onShopSelected: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  statusMessage: PropTypes.object,
  user: PropTypes.object.isRequired,
  shopsOptions: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(styles)(UserDetailForm);