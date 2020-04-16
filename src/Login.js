import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Statusbar, TextInput, SafaAreaView, KeyboardAvoidingView, ScrollView,TouchableHighlight, console} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Welcome from './Welcome';
import Signup from './SignUp';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import {AsyncStorage} from 'react-native';
import { UserService } from './service/UserService';
import Toast from 'react-native-easy-toast'
import { Utils } from './service/Utils';
class Login extends Component {
    state = {
        email: '',
        password: ''
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                //window.console.log(user);
            }
        })
    }
    
    handleChange = (text,name) => {
        let state = this.state;
        state[name] = text;
        this.setState(state);
    }

    login = async () => {
        
        let data = this.state;
        
        if(!Utils.isValidEmail(data["email"]))
        {
            this.refs.toast.show('Por favor, informe um e-mail válido.', 800, ()=>
            {
                this.refs.inputEmail.focus();
            });
            return;
        }


        if(!data['password'])
        {
            this.refs.toast.show('Por favor, informe sua senha.', 800, ()=>
            {
                this.refs.inputEmail.focus();
            });
            return;
        }

        var userService = new UserService();
        const userIdValid = await userService.isUserValidFirebase(data["email"], data["password"]);
        if(!userIdValid || userIdValid === "")
        {
            this.refs.toast.show('E-mail ou senha inválido. Por favor, verifique.', 800, ()=>
            {
                this.refs.inputEmail.focus();
            });
            return;
        }

        this.saveuserid(userIdValid);
    }

    async saveuserid(id)
    {
        await AsyncStorage.setItem('userid',"" + id);
    }

    async saverole(value)
    {
        await AsyncStorage.setItem("role",value);
    }
    async loginWithFB() {
        const {type, token} = await Facebook.logInWithReadPermissionsAsync('2274843729436475', {permissions: ['public_profile']})
                .catch(err => 
                    {
                        window.console.log("erro do facebook");
                        window.console.err(err);
                    });

        if (type == 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            
            firebase.auth().signInWithCredential(credential)
            .then(t => 
                {
                    const self = this;
                    
                    const userService = new UserService();
                    userService.getUserDatabaseID(t.user.providerData[0].uid, 
                            (_dbuserid) => { 
                                
                                
                                if(_dbuserid && _dbuserid !== "")
                                {
                                    self.saveuserid(_dbuserid); 
                                    this.props.navigation.navigate("Welcome");
                                }
                                else
                                {
                                    //create the facebook account
                                    new UserService().createUerFacebook(t.user.displayName,
                                        t.user.photoURL, t.user.providerData[0].uid,
                                        t.user.email,
                                        t.user.phoneNumber,
                                        (userdbid) => {

                                            if(userdbid && userdbid !== "")
                                            {
                                                self.saveuserid(userdbid); 
                                                this.props.navigation.navigate("Welcome");
                                            }
                                            else
                                            {
                                                this.refs.toast.show('Tivemos um problema ao criar sua conta.😥 Tente novamente.', 1200, ()=>{ });
                                            }
                                            //show an error message
                                        });
                                        
                                }
                            });
                })
            .catch((error)=>{
                window.console.log(error);
            });
        }
    }

    render() {
        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container} >
                <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
                    <Toast ref="toast" position= "top"/>
                     <View style={styles.backButtonContainer}>
                     
                        {/* <TouchableHighlight  onPress={()=>this.props.navigation.goBack(0)}>
                            <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                        </TouchableHighlight> */}
                        
                    </View>
                    <View style={styles.loginLogoContainer}>
                        <Image style={styles.logoTipo} source={require('../img/logotipo.png')}></Image>
                        <Text style={{marginTop: 0}}>Crie uma conta ou utilize seu login</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <View style={styles.fbButtonContainer}>
                            <TouchableOpacity style={styles.buttonStyle} onPress= {() => this.loginWithFB()}>
                                <Text style={styles.buttonTextStyle}>
                                    <Text style={{fontSize:24, fontWeight: 'bold'}}>f</Text>      Login com Facebook
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.signUpButtonContainer}>
                            <TouchableOpacity style={styles.signUpButtonStyle} onPress = {() => this.props.navigation.navigate('Signup')}>
                                <Text style={styles.signUpButtonTextStyle}>
                                    Cadastre-se
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{marginTop:hp('5%'), fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>OU</Text>
                        <View style={styles.textInputContainer}>
                            <TextInput autoCapitalize='none' ref="inputEmail" placeholder="Email" placeholderTextColor="#858585" style={{borderBottomColor: '#000', borderBottomWidth: 1}} enablesReturnKeyAutomatically={true} onChangeText={(text)=>{this.handleChange(text,"email")}}></TextInput>
                        </View>
                        <View style={styles.textInputContainer2}>
                            <TextInput placeholder="Senha" placeholderTextColor="#858585" secureTextEntry={true} style={{borderBottomColor: '#000', borderBottomWidth: 1, }} onChangeText = {(text)=>{this.handleChange(text,'password')}}></TextInput>
                        </View>
                        <View style={styles.loginButtonContainer}>
                            <TouchableOpacity style={styles.loginButtonStyle} onPress={this.login}>
                                <Text style={styles.loginButtonTextStyle}>
                                    Login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>   
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const RootStack = createStackNavigator({
    Login: { 
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    Welcome:{
        screen:Welcome,
        navigationOptions: {
            header: null
        }
    },
    Signup: { 
        screen: Signup,
        navigationOptions: {
            header: null
        }
    }
});
  
const AppContainer = createAppContainer(RootStack);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: wp('100%'),
        height: hp('100%')    
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
    loginLogoContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: hp('2%'),
        marginBottom: 0
    },
    logoTipo: {
        // width: wp('48%'),
        // height: hp('18%')
    },
    formContainer: {
        flex: 1,
        paddingLeft: wp('8%'),
        paddingRight: wp('8%')
    },
    fbButtonContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: hp('4%'),
        height: hp('6.5%')
    },
    buttonStyle: {
        backgroundColor: '#4764CB',
        borderRadius: 6,
        width: '100%',
        height: hp('6.5%'),
        padding:0
    },
    buttonTextStyle: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 6,
    },
    signUpButtonContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: hp('2%'),
        height: hp('6.5%')
    },
    signUpButtonStyle: {
        backgroundColor: '#FFC700',
        borderRadius: 6,
        width: '100%',
        height: hp('6.5%'),
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
    textInputContainer: {
        flex: 1,
        marginTop: hp('5%')
    },
    textInputContainer2: {
        flex: 1,
        marginTop: hp('3%')
    },
    textinput: {
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    loginButtonContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: hp('2%'),
        height: hp('6.5%')
    },
    loginButtonStyle: {
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 6,
        width: '100%',
        height: hp('6.5%'),
        padding:0
    },
    loginButtonTextStyle: {
        alignSelf: 'center',
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
    },
})

export default AppContainer;