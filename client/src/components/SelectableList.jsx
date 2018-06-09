// import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import {List, makeSelectable} from 'material-ui/List';

// const MaterialSelectableList = makeSelectable(List);

// class SelectableList extends Component {

//   componentWillMount() {
//     this.setState({
//       selectedIndex: this.props.defaultValue,
//     });
//   }

//   handleRequestChange = (event, index) => {
//     this.setState({
//       selectedIndex: index,
//     });

//     //this.onItemChosen(index);
//   };

//   render() {
//     return (
//       <MaterialSelectableList
//         value={this.state.selectedIndex}
//         onChange={this.handleRequestChange}
//       >
//         {this.props.children}
//       </MaterialSelectableList>
//     );
//   }
// }

// SelectableList.propTypes = {
//   children: PropTypes.node.isRequired,
//   defaultValue: PropTypes.number.isRequired
//   //onItemChosen: PropTypes.func.isRequired
// };

// export default SelectableList;