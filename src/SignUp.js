import React, { Component } from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity, TextInput,TouchableHighlight,KeyboardAvoidingView, ScrollView} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import * as firebase from 'firebase';
import '@firebase/firestore';
import * as Facebook from 'expo-facebook';
import Toast from 'react-native-easy-toast'
import { Utils } from './service/Utils';
import { UserService } from './service/UserService';


class SignUp extends Component{
    
    constructor(props)
    {
        super(props);
        this.state = {
            data:{
                cpf:'',
                name:'',
                phone:'',
                email:'',
                password:''
            },
            rpassword:''
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user != null) {
                console.log(user);
            }
        })
    }

    componentWillMount()
    {
        
    }

    inputs = {};

    focusTheField = (id) => {
        this.inputs[id].focus();
    }
    
    handleChange = (name,e) => 
    {
        let state = this.state;

        if(name == 'rpassword')
        {
            state[name] = e;
        }
        else
        {
            state.data[name] = e;
        }

        this.setState(state);
    }

    async loginWithFB() {
        const {type, token} = await Facebook.logInWithReadPermissionsAsync('2274843729436475', {permissions: ['public_profile']})

        if (type == 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token)

            firebase.auth().signInWithCredential(credential);
        }
    }

    signup  = async () => 
    {
        let data = this.state.data;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(!data['name'])
        {
            this.refs.toast.show("Por favor, informe seu nome!", 800, () => {
                this.refs.inputName.focus();
            });
            return;
        }
        
        if(!data["email"] || reg.test(data["email"]) == false)
        {
            this.refs.toast.show("Por favor, informe um e-mail válido!", 800, () => {
                this.refs.inputEmail.focus();
            });
            return;
        }

        if(!data["password"] || data["password"].length < 6 || !Utils.isOkPass(data["password"]).result)
        {
            
            this.refs.toast.show("A senha deve ter ao menos 6 caracteres. Use letras e ao menos 1 numero!", 2000, () => {
                this.refs.inputPass.focus();
            });
            return;  
        }

        if(this.state.rpassword != data.password)
        {
            this.refs.toast.show("As senhas digitadas estão diferentes!", 2000, () => {
                this.refs.inputConfirmPass.focus();
            });
            return;
        }

        if(!data["phone"] || data["phone"].length < 8)
        {
            this.refs.toast.show("Por favor, verifique o número de telefone digitado!", 2000, () => {
                this.refs.inputPhone.focus();
            });
            return;
        }

        const userService = new UserService();
        const existsEmail = await userService.emailExists(data["email"]);
        

        if(existsEmail)
        {
            this.refs.toast.show("😎Este e-mail já está cadastrado. Enviamos uma mensagem no seu e-mail para resetar sua senha. Use caso não se lembre! 😉", 4000, 
            () => {
                userService.sendPasswordResetEmail(data["email"]);
            });
            return;
        }

        //finally create the user on firebase authentication and database
        const created = userService.createUserFirebase(data["cpf"], data["name"], data["email"], data.password, data["phone"])
        if(!created)
        {
            this.refs.toast.show("😓 Tivemos um problema tentando criar sua conta. Por favor, tente novamente!", 3000, 
            () => {
                
            });

            return;
        }

        this.refs.toast.show("😁 Sucesso! Agora você já pode acessar nosso aplicativo e aproveitar o máximo!", 1000, 
            () => {
                this.props.navigation.navigate("Login")
            });

        // const db = firebase.database();
        // var self = this;
        // let query = db.ref("user").orderByChild("email").equalTo(data['email']);
        // db.ref("user").push(data);
        // self.props.navigation.goBack(0);
    }

    render() {
        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={styles.backButtonContainer}>
                        <Toast ref="toast" position= "top"/>
                        <TouchableHighlight  onPress={()=>this.props.navigation.goBack(0)}>
                            <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.fbButtonContainer}>
                        <TouchableOpacity style={styles.buttonStyle} onPress= {() => this.loginWithFB()}>
                            <Text style={styles.buttonTextStyle}>
                            f      Login com Facebook
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signupTextContainer}>
                        <Text style={styles.signupText}>Preencha o formulário abaixo
    para criar a sua conta</Text>
                    </View>

                    
                    <View style={styles.textInputContainer}>
                        <TextInput ref="inputName" style = {styles.CPF} placeholder="*Nome e Sobrenome" placeholderTextColor="#858585" returnKeyType={'default'} onChangeText = {(text) => {this.handleChange("name",text)}}
                         ></TextInput>
                    </View>
                    
                    <View style={styles.textInputContainer}>
                        <TextInput ref="inputEmail" style={styles.CPF} placeholder="*Email" placeholderTextColor="#858585" returnKeyType={'next'} onChangeText = {(text) => {this.handleChange("email",text)}}></TextInput>
                    </View>

                    <View style={styles.textInputContainer}>
                        <TextInput ref="inputPass" style={styles.CPF} placeholder="*Senha" secureTextEntry={true} placeholderTextColor="#858585" returnKeyType={'next'} onChangeText = {(text) => {this.handleChange("password",text)}}></TextInput>
                    </View>

                    <View style={styles.textInputContainer}>
                        <TextInput ref="inputConfirmPass" style={styles.CPF} placeholder="*Confirmar senha" secureTextEntry={true} placeholderTextColor="#858585" returnKeyType={'next'} onChangeText = {(text) => {this.handleChange("rpassword",text)}}></TextInput>
                    </View>

                    <View style={styles.textInputContainer}>
                        <TextInput ref="inputPhone" style={styles.CPF} placeholder="*Telefone com DDD" placeholderTextColor="#858585" returnKeyType={'next'} onChangeText = {(text) => {this.handleChange("phone",text)}}></TextInput>
                    </View>

                    <View style={styles.textInputContainer}>
                        <TextInput style = {styles.CPF} placeholder="CPF" placeholderTextColor="#858585" returnKeyType={'default'} onChangeText={(text)=>{this.handleChange("cpf",text)}} ></TextInput>
                    </View>

                    <View style={styles.signUpButtonContainer}>
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress={this.signup}>
                            <Text style={styles.signUpButtonTextStyle}>
                            Criar conta
                            </Text>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
        </KeyboardAvoidingView>
        )
    }
}


  
//const AppContainer = createAppContainer(RootStack);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButtonContainer: {
        alignItems: 'flex-start',
        marginTop: 83,
        marginLeft:16
    },
    backButton: {
        width: 16,
        height: 16
    },
    fbButtonContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 56,
        height: 48
    },
    buttonStyle: {
        backgroundColor: '#4764CB',
        borderRadius: 6,
        width: '80%',
        height: 48,
        padding:0
    },
    buttonTextStyle: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
    },
    signupTextContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 18
    },
    signupText: {
        width:236,
        fontSize: 16,
        lineHeight: 19,
        textAlign: 'center'
    },
    CPF: {
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#858585',
        marginBottom: 16
    }
    ,
    textInputContainer: {
        paddingLeft: 44,
        paddingRight: 44
    },
    signUpButtonContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 56,
        height: 48
    },
    signUpButtonStyle: {
        backgroundColor: '#FFC700',
        borderRadius: 6,
        width: '80%',
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

    
})

export default SignUp;