import { createMuiTheme } from 'material-ui/styles';
import red from 'material-ui/colors/red';

import grey from 'material-ui/colors/red';

const theme = createMuiTheme({
    // "checkbox": {
    //     "boxColor": grey[800],
    //     "checkedColor": red[800],
    //     "labelColor": grey[800]
    // },
    // "radioButton": {
    //     "checkedColor": red[800]
    // },
    // "toggle": {
    //     "thumbOnColor": red[800]
    // },
    // "appBar": {
    //     "color": grey[800]
    // },
    // "textField": {
    //     "focusColor": grey[800]
    // },
    // "chip": {
    //     "deleteIconColor": red[800]
    // },
    "palette": {
        "primary": {
            "main" : red[700]
        },
        "secondary": {
            "main": grey[50]
        }
        // "primary1Color": red[800],
        // "pickerHeaderColor": red[600],
        // "primary2Color": red[700],
        // "accent1Color": red[800]
    },
    // overrides: {
    //     Checkbox: {
    //       // Name of the styleSheet
    //       root: {
    //         // Name of the rule
    //         checkedColor: red[800]
    //       },
    //     },
    // }
    // ripple: {
    //     color: 'red',
    //   },
    // "snackbar": {
    //     "backgroundColor": grey[700],
    //     "actionColor": red[500]
    // },
    // "tableRow": {
    //     "stripeColor": grey[200]
    // },
    // "tabs": {
    //     "backgroundColor": grey[600]
    // }
});

export default theme;