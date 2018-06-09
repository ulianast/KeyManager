import React from 'react';

export default function EditRowModal({component: Component, dataRow}) {

  // return (
  //   <Component dataRow={dataRow} {...rest} /> 
  // )
  return class extends React.Component {
    render() {
      //return <Component dataRow={dataRow} {...this.props} />;
      return <Component {...this.props} />;
    }
  };
} 