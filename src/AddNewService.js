import React, { Component } from 'react';
import {StyleSheet, Image, TextInput, ScrollView, View, Text, CheckBox,KeyboardAvoidingView, TouchableHighlight, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import {AsyncStorage} from 'react-native';
import {ImagePicker,Permissions,Constants} from 'expo';
import ThreeAxisSensor from 'expo-sensors/build/ThreeAxisSensor';
class RegisterAddress extends Component {

    database = firebase.database();
    constructor(props)
    {
        super(props);
        this.state = {
            data:{
                file:false,
                name:"",
                price:0,
                service:"",
                param:""
            },
            enabled:false
            
        }
    }
    getPermissionAsync = async () => {
        if(Constants.platform.ios)
        {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if(status != 'granted')
            {
                alert("Sorry, we need camera roll permissions to make this work!");
            }
        }
    }
    imageSelect = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            alowEditing:true,
            asppect:[4,3]
        })

        console.log(result);
        if(!result.cancelled)
        {
            data = this.state.data;
            data.file = result.uri;

            this.setState({
                data:data,
                enable:this.getenable(data)
            })
        }
    }
    
    getenable = (data) => {
        for(item in data)
        {
            if(!data[item])
            {
                return false;
            }
        }
        return true;
    }
    handleChange = (name,value) => {
        let data = this.state.data;
        data[name] = value;

        var enable = true;

        for(item in data)
        {
            if(!data[item])
            {
                enable = false;
            }
        }
        
        console.log(enable);
        this.setState({
            data:data,
            enabled:enable
        })
    }

    setservice = (checked,value) => {
        let data = this.state.data;
        if(checked)
        {
            data.service = value;
        }
        else
        {
            data.service = "";
        }

        var enable = true;

        for(item in data)
        {
            if(!data[item])
            {
                enable = false;
            }
        }

        this.setState({
            data:data,
            enabled:enable
        })
    }

    setparam = (checked,value) => {
        let data = this.state.data;
        if(checked)
        {
            data.param = value;
        }
        else
        {
            data.param = "";
        }
        var enable = true;

        for(item in data)
        {
            if(!data[item])
            {
                enable = false;
            }
        }

        this.setState({
            data:data,
            enabled:enable
        })
    }

    save = () => {
        console.log(this.state.data);
        if(this.state.enabled)
        {
            let self = this;
            this.uploadimage(this.state.data.file,function(file){
                var data = self.state.data;
                data['file'] = file;
                console.log(data);
                self.database.ref("services").push(data);
            })
            
        }
    }

    uploadimage = async(uri,callback) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        var timestring = new Date().toLocaleString();
        var ref = firebase.storage().ref('/services').child(timestring);
        var uploadref = await ref.put(blob);
        blob.close();

        var downloadurl = await uploadref.ref.getDownloadURL();
        callback(downloadurl);
    }

    getuserid = async() => 
    {
        let userid = await AsyncStorage.getItem('userid');
        return userid;
    }
    confirm = async() =>
    {
        console.log(this.state.enabled);
        if(this.state.enabled)
        {
            var data = this.state.data;
            data['userid'] = this.getuserid();
            const db = firebase.database();
            var self = this;
            db.ref("address").push(data);

            this.props.navigation.goBack();
            this.props.navigation.state.params.location(data);
        }
    }


    render() {

        let buttonstyle = {
            textAlign: 'center',
            fontSize: 18,
            color: '#DCDCDC',
            paddingTop: 10,
            height: 48,
            width: '100%',
            borderRadius: 6
        };
        if(this.state.enabled)
        {
           buttonstyle.backgroundColor = "#FFC700"; 
           buttonstyle.color = 'black';
        }
        
        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <ScrollView style = {styles.container}>
                    <View style={styles.backButtonContainer}>
                        <TouchableHighlight onPress={()=>this.props.navigation.goBack(0)}>
                            <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                        </TouchableHighlight>
                        <Text style={styles.backToHomeText}>Adicione novos serviços ou produtos</Text>
                    </View>
                    <View style={styles.uploadImgContainer}>
                    {
                        !this.state.data.file && 
                            <TouchableHighlight onPress={this.imageSelect}>
                                <Image source={require('../img/upload_icon.png')}></Image>
                            </TouchableHighlight>
                    }
                    {
                        this.state.data.file && 
                            <TouchableHighlight onPress={this.imageSelect}>
                                <Image source={{uri:this.state.data.file}} style={{width:156,height:156,borderRadius:78}}></Image>
                            </TouchableHighlight>
                    }   
                 </View>
                    <View style={styles.textInputContainer}>
                        <TextInput style = {styles.CPF} placeholder="Nome" placeholderTextColor="#858585"  onChangeText={(value)=>{this.handleChange("name",value)}}></TextInput>
                    </View>
                    <View style={styles.textInputContainer1}>
                        <TextInput style = {styles.CPF} placeholder="descrição" placeholderTextColor="#858585" multiline={true} numberOfLines={6} onChangeText={(value)=>{this.handleChange("description",value)}}></TextInput>
                    </View>
                    <View style={styles.textInputContainer2}>
                        <Text style = {styles.priceLabel}>R$</Text>
                        <TextInput style = {styles.priceInput} placeholder="Preço" placeholderTextColor="#858585" onChangeText={(value)=>{this.handleChange("price",value)}}></TextInput>
                    </View>
                    <View style={styles.typeContainer}>
                        <Text style={{fontSize: 18, flex: 1}}>Type:</Text>
                        <View style={{flex: 4, flexDirection: 'row'}}>
                            <View style={{flex:1, flexDirection: 'row'}}>
                                <Text style={{fontSize: 16}}>Serviço</Text>
                                <CheckBox value={this.state.data.service == "Service"} onValueChange={(value)=>{this.setservice(value,"Service")}}/>
                            </View>
                            <View style={{flex:1, flexDirection: 'row'}}>
                                <Text style={{fontSize: 16}}>produtos</Text>
                                <CheckBox value={this.state.data.service == 'product'} onValueChange = {(value)=>this.setservice(value,"product")}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.typeContainer}>
                        <Text style={{fontSize: 18, flex: 2}}>Indicado para:</Text>
                        <View style={{flex: 3, flexDirection: 'row'}}>
                            <View style={{flex:1, flexDirection: 'row'}}>
                                <Text style={{fontSize: 16}}>Gato</Text>
                                <CheckBox  value={this.state.data.param == 'gato'} onValueChange = {(value)=>this.setparam(value,"gato")}/>
                            </View>
                            <View style={{flex:1, flexDirection: 'row'}}>
                                <Text style={{fontSize: 16}}>Cão</Text>
                                <CheckBox  value={this.state.data.param == 'cao'} onValueChange = {(value)=>this.setparam(value,"cao")}/>
                            </View>
                            <View style={{flex:1, flexDirection: 'row'}}>
                                <Text style={{fontSize: 16}}>Ambos</Text>
                                <CheckBox  value={this.state.data.param == 'ambos'} onValueChange = {(value)=>this.setparam(value,"ambos")}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.signUpButtonContainer}>
                        <TouchableOpacity style={styles.signUpButtonStyle} onPress = {this.save}>
                            <Text style={styles.signUpButtonTextStyle}>
                                Salvar e continuar
                            </Text>
                        </TouchableOpacity>
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
    uploadImgContainer: {
        height: 240,
        width: '100%',
        backgroundColor: '#efefef',
        alignItems: 'center',
        justifyContent: 'center',
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
    priceLabel: {
        height: 48,
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 12
    },
    priceInput: {
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#858585',
        fontSize: 16,
        marginLeft: 12,
        width: 160
    },
    textInputContainer: {
        marginTop: 8,
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    textInputContainer1: {
        marginTop: 18,
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    textInputContainer2: {
        marginTop: 18,
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    typeContainer : {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 24,
        height: 48
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
    signUpButtonContainer: {
        flex: 1,
        alignItems: 'center',
        height: 48, 
        marginBottom: 24,
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