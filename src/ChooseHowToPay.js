import React, { Component } from 'react';
import {StyleSheet, Image, TextInput, ScrollView, View, Text, Switch} from 'react-native';
import RadioButton from './components/RadioButton';


const options =[{
    key: 'finalFourCardNum',
    text: 'Final 0000'
}]

class ChooseHowToPay extends Component {
    render() {
        return(
            <ScrollView style = {styles.container}>
                <View style={styles.backButtonContainer}>
                    <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                    <Text style={styles.backToHomeText}>Forma de pagamento</Text>
                 </View>
                 <View style={styles.uploadImgContainer}>
                    <Text style={styles.uploadText}>Escolha como pagar</Text>
                 </View>
                 <View style={styles.creditCardSelectContainer}>
                    <Switch></Switch>
                    <Text style={{fontSize: 16, fontWeight: '500', marginLeft: 30}}>Cartão de crédito</Text>
                 </View>
                 <View style={styles.addCardContainer}>
                    <View style={styles.addCardTextContainer}>
                        <Text>Escolha ou adicione um cartão</Text>
                    </View>
                    <View style={styles.chooseCardContainer}>
                        <Image source={require('../img/plus.png')}></Image>
                        <Text style={{fontSize: 14, fontWeight: 'bold', marginLeft: 15}}>Cadastrar um novo cartão</Text>
                    </View>
                    <View style={{flex: 1, paddingLeft: 15, paddingRight: 15, height: 60, paddingTop: 23}}>
                        <RadioButton options={options} ></RadioButton>
                    </View>
                 </View>
                 <View style={{flex: 1, flexDirection: 'row', marginTop: 18, paddingLeft: 15, paddingRight: 15}}>
                    <Switch></Switch>
                    <Text style={{marginLeft: 33}}>Pagamento na loja</Text>
                 </View>
                 <View style={styles.registerButtonContainer}>
                    <Text style={styles.registerButtonText}>Salvar</Text>
                </View>
            </ScrollView>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    backToHomeText: {
        fontSize: 16,
        marginTop: 16
    },
    uploadImgContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        height: 48,
    },
    uploadText: {
        fontSize: 16,
        marginTop: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    cardNumContainer: {
        flex: 1,
        height: 30,
        paddingLeft: 15,
        paddingRight: 15
    },
    cardNumInput: {
        flex: 1,
        flexDirection: 'row',
        height: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#858585',
        fontSize: 16
    },
    textInputContainer: {
        marginTop: 30,
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    CPF: {
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#858585',
        fontSize: 16
    },
    textInputContainer1: {
        marginTop: 24,
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    textInputContainer2: {
        marginTop: 24,
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    infoImage: {
        paddingTop: 16,
    },
    petOne: {
        width: '80%',
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#858585',
        marginRight: 37,
        fontSize: 16
    },
    registerButtonContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 30,
        alignItems: 'center',
        justifyContent:'center'
    },
    registerButtonText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#DCDCDC',
        paddingTop: 10,
        height: 48,
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 6
    },
    creditCardSelectContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    addCardContainer: {
        flex: 1,
        height: 192,
        backgroundColor: '#efefef'
    },
    addCardTextContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 23,
        fontSize: 14,
        height: 60 
    },
    chooseCardContainer: {
        flex: 1,
        height: 60,
        paddingTop: 23,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 1,
    },
    registerButtonContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 30,
        alignItems: 'center',
        justifyContent:'center'
    },
    registerButtonText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#DCDCDC',
        paddingTop: 10,
        height: 48,
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 6
    }

})

export default ChooseHowToPay;