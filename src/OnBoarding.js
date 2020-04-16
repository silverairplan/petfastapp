import React, { Component } from 'react';
import {StyleSheet, View, Text, Button, Image,ScrollView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Login from './Login';
import Signup from './SignUp';
import AppIntroSlider from 'react-native-app-intro-slider';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {LinearGradient} from 'expo';

const slider = [{
    key:"slider1",
    title:"Cadastre seu bichinho",
    text:"Crie um perfil para o seu animal",
    image:require('../img/intro1.png')
},{
    key:"slider2",
    title:"Agende serviços",
    text:"Todos os serviços para \n seu bichinho direto no celular",
    image:require('../img/intro2.png')
},{
    key:"slider3",
    title:"Ganhe descontos",
    text:"Acesse descontos exclusivos\ndo Petshop Capital",
    image:require('../img/intro3.png')
}]

class OnBoarding extends Component {

    renderitem = ({item,dimensions}) => {
        return (
            <View
                style={{flex:1,alignItems:"center",justifyContent:'space-around'}}
             >
                <View>
                    <Image source={item.image} style={styles.onBoardingImage}>
                    </Image>
                </View>
                <View style={styles.introText}>
                    <Text style={styles.introTitle}>{item.title}</Text>
                    <Text style={styles.introContent}>{item.text}</Text>
                </View>
            </View>
        )
    }

    render() {
        return(
            <ScrollView style={styles.container}>
                <View style={
                    styles.imageContainer
                    }>
                    <AppIntroSlider
                        slides={slider}
                        renderItem={this.renderitem}
                        showDoneButton={false}
                        showNextButton={false}
                        showPrevButton={false}
                        showSkipButton={false}
                        dotStyle={{backgroundColor:'#858585',marginTop:hp('20%'), marginLeft: wp('4%')}}
                        activeDotStyle={{backgroundColor:'#FF4D00',marginTop:hp('20%'), marginLeft: wp('4%')}}
                    ></AppIntroSlider>
                </View>
                
                <TouchableOpacity >
                    <View style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle} onPress={()=>this.props.navigation.navigate("Signup")}>
                            Cadastre-se
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{marginTop: hp('3%'), justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{color: '#858585'}}>ou <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}} onPress={()=>this.props.navigation.navigate("Login")}>Faça o Login</Text></Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    maincontent:{
        flex:3,
        alignItems:"center",
        justifyContent:"space-around",
    },
    container: {
        flex: 1,
        width: wp('100%'),
        height: hp('100%'),
        marginBottom: wp('5%')
    },
    imageContainer: {
        
        marginTop: hp('10%'),
        alignItems: 'center',
        flex:1,
        flexDirection: 'column',
    },
    onBoardingImage: {
        width: wp('68%'),
        height: hp('50%'),
        borderRadius: 20,
    },
    introTitle: {
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: wp('5%')
    },
    introText: {
        flex: 1,
        alignItems: 'center',
        marginTop: hp('4.5%')
    },
    introContent: {
        flex: 1,
        textAlign: 'center',
        fontSize: wp('4%'), 
        color: '#858585'
    },
    buttonTextStyle: {
        width: wp('78%'),
        height: hp('7%'),
        backgroundColor: '#FFC700',
        alignSelf: 'center',
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: hp('2%'),
        paddingBottom: hp('2%'),
        borderRadius: 8,
        alignItems: 'center',
        textAlign: 'center'
    },
    buttonStyle: {
        flex:1,
        alignItems: 'center',
        // paddingLeft: wp('7%'),
        // paddingRight: wp('7%'),
        marginTop: hp('10%')
    }
})

const RootStack = createStackNavigator({
    onboarding: { 
        screen: OnBoarding,
        navigationOptions: {
            header: null
        }
    },
    Login:{
        screen:Login,
        navigationOptions: {
            header: null
        }
    },
    Signup: { 
        screen: Signup,
        navigationOptions: {
            header: null
        }
    },
});
  
const AppContainer = createAppContainer(RootStack);
export default AppContainer;