import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
//import Splash from './src/Splash';
//import AppContainer from './src/OnBoarding';
import SignUp from './src/SignUp';
import Welcome from './src/Welcome';
import RegisterPet from './src/RegisterPet';
import Services from './src/Services';
import ConfirmServices from './src/ConfirmServices';
import ServiceList from './src/ServiceList';
import RegistrationTip from './src/RegistrationTip';
import Summary from './src/Summary';
import Agenda from './src/Agenda';
import Checkout from './src/Checkout';
import ChooseHowToPay from './src/ChooseHowToPay';
import RegisterAddress from './src/RegisterAddress';
import CheckOutSuccess from './src/CheckOutSuccess';
import CheckOutFail from './src/CheckOutFail';
import ServiceScheduled from './src/ServiceScheduled';
import Live from './src/Live';
import StatusBar from './src/StatusBar';
import AppContainer from './src/Splash';
export default function App() {
  
   //initialize Firebase
   const firebaseConfig = {
    apiKey: 'AIzaSyBXxqZ-62JF1z5RXe4CCEfwwJX4-BZENus',
    authDomain: "techpet-6f06a.firebaseapp.com",
    databaseURL:"techpet-6f06a.firebaseio.com/",
    storageBucket: "techpet-6f06a.appspot.com",
  }
  
  firebase.initializeApp(firebaseConfig);

  return (
    <View style={styles.container}>
      <AppContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
