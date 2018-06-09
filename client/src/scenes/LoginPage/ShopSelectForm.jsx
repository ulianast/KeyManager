import React from 'react';
import PropTypes from 'prop-types';
//import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
//import TextField from 'material-ui/TextField';
//import { withStyles } from 'material-ui/styles';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

class ShopSelectFrom extends React.Component {
  render() {
    const { user, onChange, shopOptions, errors, onSubmit } = this.props;

    return(
      <div>
        <h2 className="card-heading">Выберите торговую точку</h2>
        <div className="text-line">
          <FormControl>
            <InputLabel htmlFor="select-shop">Торговая точка</InputLabel>
            <Select
              id="select-shop"
              value={user.shop}
              onChange={onChange}
              inputProps={{
                name: 'shop',
                id: 'select-shop',
              }}
            >
              {
                shopOptions.map(shopOption => (
                  <MenuItem
                    key={shopOption.id}                 
                    value={shopOption.id}
                  >
                    {shopOption.address}
                  </MenuItem>
                ))
              }
            </Select>
            {errors.shop && <FormHelperText className="" error id="select-shop-error-text">{errors.shop}</FormHelperText>}
          </FormControl>      
        </div>

        <div className="button-line">
          <Button variant="raised" type="submit" color="primary" onClick={onSubmit}>
            Выбрать магазин
          </Button>
        </div>     
      </div>
    )
  }
}

ShopSelectFrom.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  shopOptions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ShopSelectFrom;
