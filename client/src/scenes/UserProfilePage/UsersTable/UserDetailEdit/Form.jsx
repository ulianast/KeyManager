import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import Input, { InputLabel } from 'material-ui/Input';
import { ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import { FormControl, FormHelperText } from 'material-ui/Form';
import _ from 'lodash';
import { CREATE_MODE, EDIT_MODE } from './constants';
import './styles.css'


const styles = {
  formControl: {
    minWidth: 250,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  }
};

const getShopLabel = (value, shopOptions) => {
  const index = _.findIndex(shopOptions, item => { return item.value === value; });
  return index > -1 ? shopOptions[index].label : value;
}

class UserDetailForm extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isPasswordsOpen: props.mode === CREATE_MODE
    }
  }

  onResetPasswordClick = () => {
    this.setState({
      isPasswordsOpen: true
    })
  }

  render() {
    const { classes, onChange, onLoginInputEnd, onShopSelected, onRoleSelected, errors,
      user, shopsOptions, roleOptions, mode } = this.props;

    return (
      <div className="user-detail-form"> 
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

          { mode === EDIT_MODE && 
            <div className="text-line">
              <Button onClick={this.onResetPasswordClick} color="primary" variant="raised">
                Сбросить пароль
              </Button> 
            </div>
          }

          { (mode === CREATE_MODE || this.state.isPasswordsOpen) && 
            <div>
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
                {errors.password && 
                  <FormHelperText className="" error id="password-error-text">{errors.password}</FormHelperText>
                }
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
                {errors.repeatPassword && 
                  <FormHelperText error id="repeatPassword-error-text">{errors.repeatPassword}</FormHelperText>
                }
              </FormControl> 
            </div>
            </div>
          }
      </div>
    )
  }
}

UserDetailForm.propTypes = {
  classes: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  // onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onLoginInputEnd: PropTypes.func.isRequired,
  onShopSelected: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  shopsOptions: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(styles)(UserDetailForm);