import React, { Component } from 'react';
import {StyleSheet, Image, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, DrawerActions } from 'react-navigation';

class Welcome extends Component {
    render(){
        return(
            <ScrollView style={styles.container}>
                <View style={styles.backButtonContainer}>
                    <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                 </View>
                 <View style={styles.petFootprintIcon}>
                    <Image style={styles.petFootprintImg} source={require('../img/checkout_success.png')}></Image>
                 </View>
                 <Text style={styles.regTitle}>Agendamento realizado!</Text>
                 <View style={styles.regInfoContent}>
                    <Text>
                        <Text style={{fontWeight: 'bold'}}>Iremos entrar em contato para acertar tudo!</Text>{'\n'}{'\n'}
                        <Text style={{color: '#858585', fontSize: 14, lineHeight: 24}}>Verifique em seu perfil se o seu número de telefone está correto.</Text>{'\n'}{'\n'}
                        <Text style={{color: '#858585', fontSize:14, lineHeight: 24}}>Estamos aperfeiçoando a experiência de uso de nosso APP.</Text>{'\n'}
                        <Text style={{color: '#858585', fontSize:14, lineHeight:24}}>Caso tenha algum problema, por favor, nos avise!</Text>
                    </Text>
                 </View>
                 <View style={styles.signUpButtonContainer}>
                    <TouchableOpacity style={styles.signUpButtonStyle}  onPress={()=>this.props.navigation.navigate("Agenda")}>
                        <Text style={styles.signUpButtonTextStyle}>
                            Ok, entendido
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backButtonContainer: {
        height: 60,
        flexDirection: 'row',
        marginTop: 66,
        paddingLeft: 18,
    },
    backButton: {
        width: 16,
        height: 16,
        marginLeft: 3,
        marginRight: 28,
        marginTop: 16
    },
    signUpButtonContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 60,
        height: 48,
        paddingLeft: 15,
        paddingRight: 15
    },
    signUpButtonStyle: {
        backgroundColor: '#FFC700',
        borderRadius: 6,
        width: '100%',
        height: 48,
        padding:0
    },
    signUpButtonTextStyle: {
        alignSelf: 'center',
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
    },
    petFootprintIcon: {
        flex: 1,
        marginTop: 54,
        paddingLeft: 15,
        paddingRight: 15
    },
    petFootprintImg: {
        width: 60,
        height: 60
    },
    regTitle: {
        flex: 1,
        height: 60,
        fontSize: 28,
        fontWeight: 'bold',
        paddingTop: 21,
        paddingLeft: 15,
        paddingRight: 15
    },
    regInfoContent: {
        flex: 1,
        fontSize: 14,
        marginTop: 18,
        paddingLeft: 15,
        paddingRight: 15,
        lineHeight: 24
    }

})

export default Welcome;