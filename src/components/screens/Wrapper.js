import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Wrapper = ({ children, isLoading }) => (
  <View style={{ flex: 1 }}>
    <StatusBar barStyle="light-content" backgroundColor="#16a085" />
    {children}
    <Spinner visible={isLoading} />
  </View>
);

// class Wrapper extends Component {
//   componentDidUpdate() {
//     if (this.props.barMessageProps !== prevProps.barMessageProps) {
//       console.log('it changed');
//     }
//   }
//
//   render() {
//     const { children, isLoading } = this.props;
//     return (
//       <View style={{ flex: 1 }}>
//         <StatusBar barStyle="light-content" backgroundColor="#16a085" />
//         {children}
//         <Spinner visible={isLoading} />
//       </View>
//     );
//   }
// }

export default Wrapper;
