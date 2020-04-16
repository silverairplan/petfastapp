import React, { Component } from 'react';
import {StyleSheet, Image, TextInput, ScrollView, View, Text, Switch,KeyboardAvoidingView ,TouchableHighlight} from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { AsyncStorage } from 'react-native';
import { SearchAddressService } from './service/SearchAddressService';
import Toast from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay'

class RegisterAddress extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            spinner: false,
            data:{
                cep:"",
                end:"",
                num:"",
                comp:"",
                bair:"",
                cidado:"",
                estado:"",
                descendereco:""
            },
            enabled:false
        }
    }

    handleChange = (name,value) => {
        let data = this.state.data;
        data[name] = value;

        var enable = true;

        if (!data['cep']
            || !data['end']
            || !data['bair']
            || !data['cidado']
            || !data['estado']
            || !data['descendereco']) {
            enable = false;
        }
        this.setState({
            data:data,
            enabled:enable
        })
    }

    getuserid = async() => 
    {
        let userid = await AsyncStorage.getItem('userid');
        return userid;
    }

    confirm = async() =>
    {
        if(this.state.enabled)
        {
            this.setState({
                spinner: true
            });

            var data = this.state.data;
            data['userid'] = await this.getuserid();

            const db = firebase.database();
            db.ref("address").push(data);

            this.setState({
                spinner: false
            });

            this.props.navigation.goBack();
        }
    }

    getServicePostalCode(postalcode)
    {
        if(!postalcode || postalcode.toString().length != 8)
            return;


        var service = new SearchAddressService();
        service.searchAddressFromCEPAsync(postalcode)
            .then(info => 
                {

                    if(!info || !info.cep || info.cep === "")
                    {
                        this.handleChange('cep', postalcode);
                        return;
                    }

                    this.handleChange('bair', info.bairro);
                    this.handleChange('end', info.logradouro);
                    
                    this.state.data.cep = postalcode;
                    
                    this.state.data.bair = info.bairro;
                    this.state.data.cidado = info.localidade,
                    this.state.data.estado = info.uf;

                    this.handleChange('cep', postalcode);
                    window.console.log('settted state');
                    window.console.log(info);
                })
                .catch(err => 
                    {
                        this.refs.toast.show("Tivemos um problema ao buscar o CEP. Você ainda pode preencher manualemnte o seu endereço.", 5000, ()=> {});
                    });
    }
    
    render() {

        let buttonstyle = {
            textAlign: 'center',
            fontSize: 18,
            color: '#DCDCDC',
            paddingTop: 10,
            height: 48,
            width: '100%',
            borderRadius: 6,
            marginTop: 36
        };
        if(this.state.enabled)
        {
           buttonstyle.backgroundColor = "#FFC700"; 
           buttonstyle.color = 'black';
        }
        
       
        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <ScrollView style = {styles.container}>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Carregando...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                    <Toast ref="toast" position= "top"/>

                    <View style={styles.backButtonContainer}>
                        <TouchableHighlight onPress={()=>this.props.navigation.goBack(0)}>
                            <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                        </TouchableHighlight>
                        <Text style={styles.backToHomeText}>Cadastro de endereço</Text>
                    </View>

                    <View style={styles.textInputContainer}>
                        <TextInput style = {styles.CPF} keyboardType="numeric" placeholder="digite seu CEP" placeholderTextColor="#858585" onChangeText={(value)=>{this.getServicePostalCode(value)}}></TextInput>
                    </View>
                    <View style={styles.textInputContainer1}>
                        <TextInput style = {styles.CPF} value={this.state.data.end} placeholder="endereço" placeholderTextColor="#858585" onChangeText={(value)=>{this.handleChange("end",value)}}></TextInput>
                    </View>
                    <View style={styles.textInputContainer1}>
                        <TextInput style = {styles.CPF} keyboardType="numeric" placeholder="número" placeholderTextColor="#858585" onChangeText={(value)=>{this.handleChange("num",value)}} editable ={!this.state.complement}></TextInput>
                    </View>
                    <View style={styles.textInputContainer1}>
                        <TextInput style = {styles.CPF} placeholder="complemento" placeholderTextColor="#858585" onChangeText={(value)=>{this.handleChange("comp",value)}}></TextInput>
                    </View>
                    <View style={styles.textInputContainer1}>
                        <TextInput style = {styles.CPF} placeholder="bairro" placeholderTextColor="#858585" value={this.state.data.bair} onChangeText={(value)=>{this.handleChange("bair",value)}}></TextInput>
                    </View>
                    <View style={styles.textInputContainer1}>
                        <TextInput style = {styles.CPF} editable={false} value={this.state.data.cidado} placeholder="Cidade" placeholderTextColor="#858585" onChangeText={(value)=>{this.handleChange("cidado",value)}}></TextInput>
                    </View>
                    <View style={styles.textInputContainer1}>
                        <TextInput style = {styles.CPF} editable={false} value={this.state.data.estado} placeholder="Estado" placeholderTextColor="#858585" onChangeText={(value)=>{this.handleChange("estado",value)}}></TextInput>
                    </View>

                    <View style={styles.textInputContainer}>
                        <TextInput style = {styles.CPF} placeholder="escreva 'casa'🏘 ou 'trabalho'🏢" placeholderTextColor="#858585" onChangeText={(value)=>{this.handleChange("descendereco",value)}}></TextInput>
                    </View>

                    <View style={styles.registerButtonContainer}>
                        <Text style={buttonstyle} onPress={this.confirm}>Cadastrar endereço</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    textInputContainer: {
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
        marginTop: 18,
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
        marginTop: 10,
        alignItems: 'center',
        justifyContent:'center',
        marginBottom: 20
    },
    registerButtonText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#DCDCDC',
        paddingTop: 10,
        height: 48,
        width: '100%',
        borderRadius: 6,
        marginTop: 36
    },
    switchContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15, 
        paddingRight: 15,
        height: 48,
        marginTop: 18
    }

})

export default RegisterAddress;