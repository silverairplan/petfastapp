import React, { Component } from 'react';
import {StyleSheet, Image, View} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import OnBoarding from './OnBoarding';
import { UserService } from './service/UserService';
class Splash extends Component {
    componentDidMount()
    {
        let self = this;
        setTimeout(()=>
        {
            //validate if user is logged
            const userService = new UserService();
            userService.checkIsUserLoggedAsync()
                .then((islogged) => 
                {
                    if(islogged)
                        this.props.navigation.navigate("Welcome");
                    else
                        this.props.navigation.navigate("onBoarding");
                });

        }, 500);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style = {styles.logoContainer}>
                    <Image style={styles.logo} source={require('../img/logotipo.png')}></Image>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFC700',
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    logo: {
        width: 192,
        height: 132
    }
})

const RootStack = createStackNavigator({
    Splash: { 
        screen: Splash,
        navigationOptions: {
            header: null
        }
    },
    onBoarding:{
        screen: OnBoarding,
        navigationOptions: {
            header: null
        }
    }
});
  
const AppContainer = createAppContainer(RootStack);
export default AppContainer;