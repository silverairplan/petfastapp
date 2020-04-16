import React, { Component } from 'react';
import {StyleSheet, Image, TextInput, ScrollView, View, Text,TouchableHighlight,Alert, KeyboardAvoidingView,CheckBox} from 'react-native';
import {ImagePicker,Permissions,Constants} from 'expo';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import AddAddress from './RegisterAddress';
import * as firebase from 'firebase';
import '@firebase/firestore';
import {AsyncStorage} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay'

class RegisterPet extends Component {
    database = firebase.database();
    constructor(props)
    {
        super(props);
        this.state = {
            spinner: false,
            data:{
                file:false,
                cpf:'',
                email:'',
                name:'',
                //password:'',
                phone:'',
                // position:''
            },
            pets:[],
            enable:false,
            files:[],
            positiondata:[]        
        }
    }

    componentDidMount() 
    {
       let self = this;
       this.getuserid().then(function(userid)
       {

           self.database.ref("/user/"+userid).on('value', snapshot =>
           {
                let l = snapshot.val();
                let data = self.state.data;
                for(let item in l)
                {
                    data[item] = l[item];
                }

                data.file = l.profilePicture;

                self.setState(data);

                self.updateinfo();
                self.getpets(userid);
           });
        })
    }

    updateinfo = async() => {
        let userid = await this.getuserid();
        let self = this;
        this.database.ref("/address").on('value',snapshot=>{
            let data = [];
            snapshot.forEach(c=>{
                let value = c.val();
                if(value.userid == userid)
                {
                    const descendereco = value['descendereco'];
                    data.push((descendereco && descendereco !== "" ? descendereco : value.end));
                }
            })
            self.setState({
                positiondata:data
            })
        })
    }

    getpets = (userid) => {
        let self = this;
        this.database.ref("/pet").on('value',snapshot=>{
            var pets = [];
            if(snapshot.exists)
            {
                snapshot.forEach(c=>{
                    var valuedata = c.val();
                    if(valuedata.userid && valuedata.userid == userid)
                    {
                        pets.push(valuedata);
                    }
                    self.setState({
                        pets:pets
                    });
                })
            }
        })
    }

    getuserid = async() => 
    {
        let userid = await AsyncStorage.getItem('userid');
        return userid;
    }


    imagepicker = async () => {
        await this.getPermissionAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            alowEditing:true,
            aspect:[4,3]
        })

        if(!result.cancelled)
        {
            let files = this.state.files;
            files.push(result.uri);
            this.setState({
                files:files
            })
        }
    }

    imageSelect = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            alowEditing:true,
            asppect:[4,3]
        })

        if(!result.cancelled)
        {
            let data = this.state.data;
            data.file = result.uri;

            this.setState({
                data:data,
                enable:this.getenable(data)
            })
        }
    }
    
    uploadimage = async(uri,callback) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        var timestring = new Date().toLocaleString();
        var ref = firebase.storage().ref('/user').child(timestring);
        var uploadref = await ref.put(blob);
        blob.close();

        var downloadurl = await uploadref.ref.getDownloadURL();
        callback(downloadurl);
    }

    getenable = (data) => {
        let enable = true;
        for(let item in data)
        {
            if(!data[item])
            {
                enable = false;
            }
        }
        return enable;
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

    handleChange = (value,name) => {
        let data = this.state.data;
        data[name] = value;
        this.setState({
            data:data,
            enable:this.getenable(data)
        })
    }

    register = async() => {
        this.setState({
            spinner: true
        });

        var self = this;
        let data = this.state.data;
        if (data['file']) {
            this.uploadimage(data['file'],function(file){
                data['profilePicture'] = file;
                self.getuserid().then(function(userid){
                    self.finish(self, userid, data);
                });
            });    
        }
        else {
            self.getuserid().then(function(userid){
                self.finish(self, userid, data);
            });
        }
    }

    finish = (self, userid, data) =>{
        self.database.ref('/user/' + userid).set(data);
        self.setState({
            spinner: false
        });
    }

    location = (data) =>{
        let position = this.state.positiondata;
        position.push(data.end);
        this.setState({
            positiondata:position
        })
    }

    logout = () => 
    {
        AsyncStorage.clear();
        this.resetStack();
    }

    //used for logout function
    resetStack = () => {
        this.props
          .navigation
          .dispatch(StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Splash',
                params: { param: 'no param' },
              }),
            ],
          }))
       }

    positionselect = (item,value)=>
    {
        var data = this.state.data;
        data['position'] = item;
        
        if(!value)
            data['position'] = '';
            
        this.setState({data:data});
    }

    render() {
        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView style = {styles.container}>    
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Carregando...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={styles.backButtonContainer}>
                    <TouchableHighlight onPress={()=>this.props.navigation.navigate('Welcome')}>
                        <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                    </TouchableHighlight>
                    
                    <Text style={styles.backToHomeText}>Perfil</Text>
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
                    
                    <Text style={{marginTop: 12, fontSize: 16, fontWeight: 'bold', color: '#858585'}}>FOTO DO PERFIL</Text>
                 </View>
                 <View style={styles.cpfTextInputContainer}>
                 <TextInput style = {styles.CPF} placeholder="CPF" placeholderTextColor="#858585" onChangeText={(value)=>this.handleChange(value,'cpf')} defaultValue={this.state.data.cpf}></TextInput>
                    {/* <Text style={{color: '#858585'}}>CPF</Text>
                    <Text style={styles.cpfNum}>{this.state.data.cpf}</Text> */}
                    {/* <Dash style={{height:1}} dashColor="#858585"></Dash> */}
                </View>
                 <View style={styles.textInputContainer}>
                    <TextInput style = {styles.CPF} placeholder="Nome" placeholderTextColor="#858585" onChangeText={(value)=>this.handleChange(value,'name')} defaultValue={this.state.data.name}></TextInput>
                </View>
                <View style={styles.textInputContainer1}>
                    <TextInput style = {styles.CPF} placeholder="Email" placeholderTextColor="#858585"  onChangeText={(value)=>this.handleChange(value,'email')}  defaultValue={this.state.data.email}></TextInput>
                </View>
                <View style={styles.textInputContainer1}>
                    <TextInput style = {styles.CPF} placeholder="Telefone" placeholderTextColor="#858585"  onChangeText={(value)=>this.handleChange(value,'phone')}  defaultValue={this.state.data.phone}></TextInput>
                </View>
                
                <ScrollView style={styles.horizontalScrollView} horizontal='true'>
                    <View style={{flex:1, flexDirection: 'row', paddingLeft: 15, paddingRight: 15}}>
                        {
                            this.state.pets.map((row,index)=>{
                                return (
                                    <View key={index}>
                                        <Image key={"image_" + index} style={{width:70,height:70, borderRadius: 35, marginLeft: 6}} source={{uri:row.file}}></Image>
                                        <Text style={{textAlign: 'center', marginTop: 2}}>{row.name}</Text>
                                    </View>
                                    
                                )
                            })
                        }
                        <View>
                            <TouchableHighlight onPress={this.imagepicker}>
                                <Image style={{width: 70, height: 70, marginLeft: 6}} source={require('../img/add_pet.png')}></Image>
                            </TouchableHighlight>
                            <Text style={{textAlign: 'center', marginTop: 2}}>Novo</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* not needed for now */}
                {/* <View>
                    <Text style={{fontWeight: 'bold', height: 48, paddingTop: 16, paddingLeft: 15, paddingRight: 15}}>Seus pets</Text>
                </View> */}
                
                
                {/* <View style={{flex:1, flexDirection: 'row', paddingLeft: 15, paddingRight: 15}}>
                    {
                        this.state.pets.map((row,index)=>{
                            return (
                                <Image key={"image_" + index} style={{width:70,height:70, borderRadius: 35, paddingLeft: 10}} source={{uri:row.file}}></Image>
                            )
                        })
                    }
                    <View>
                        <TouchableHighlight onPress={this.imagepicker}>
                            <Image style={{width: 70, height: 70}} source={require('../img/add_pet.png')}></Image>
                        </TouchableHighlight>
                        <Text style={{textAlign: 'center', marginTop: 4}}>Novo</Text>
                    </View>
                    
                </View> */}

                <View style={{flex:2, backgroundColor: '#ededed', height: 192}}>
                    <View >
                        <Text style={{height: 60, paddingLeft: 15, paddingRight: 15, paddingTop: 23}}>Meus endereços</Text>
                        <Text style={{height: 60, paddingLeft: 15, paddingRight: 15, paddingTop: 23, fontWeight: 'bold', marginBottom: 10}} onPress={()=>this.props.navigation.navigate("addlocation",{location:this.location})}><Text style={{fontSize: 24}}>+  </Text>Cadastrar um novo endereço</Text>
                        <View style={{borderBottomColor: '#858585', borderBottomWidth: 1, marginLeft: 15, marginRight: 15, height:2}}></View>
                    </View>
                    
                    {
                        this.state.positiondata.map((row,index)=>{
                            return (
                                <View key={index} style={styles.positionselect}>
                                    <Text>{row}</Text>
                                    {/* not needed for now */}
                                    {/* <CheckBox style={{marginLeft:"auto"}} onValueChange = {(value)=>{this.positionselect(row,value)}} ></CheckBox> */}
                                </View>
                            )
                        })
                    }
                </View> 
                <View style={styles.registerButtonContainer}>
                    <Text style={styles.enablebutton} onPress={this.register}>Salvar Cadastro</Text>
                </View>

                <View style={styles.registerButtonContainer}>
                    <Text style={styles.logoutbutton} onPress={this.logout}>Sair</Text>
                </View>

            </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const RootStack = createStackNavigator({
    profile:{
        screen:RegisterPet,
        navigationOptions: {
            header: null
        }
    },

    addlocation:{
        screen:AddAddress,
        navigationOptions: {
            header: null
        }
    }
});
  
const AppContainer = createAppContainer(RootStack);
export default AppContainer;
const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
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
    uploadText: {
        fontSize: 16,
        marginTop: 16,
        fontWeight: 'bold',
        color: '#858585'
    },
    cpfTextInputContainer: {
        flex: 1,
        marginTop: 30,
        paddingLeft:15,
        paddingRight: 15,
    },
    cpfNum: {
        color: '#858585',
        height: 38
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
    horizontalScrollView: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 6,
        paddingRight: 16,
        marginTop: 18,
        marginBottom: 12
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
    positionselect:{
        flex:1,
        flexDirection:'row',
        paddingLeft:15,
        paddingRight:15,
        alignItems:"center"
    },
    registerButtonContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 8,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent:'center'
    },
    registerButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000',
        paddingTop: 10,
        height: 44,
        width: '100%',
        backgroundColor: '#ffc700',
        borderRadius: 6
    },
    enablebutton:{
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        paddingTop: 10,
        height: 44,
        width: '100%',
        backgroundColor: '#FFC700',
        borderRadius: 6
    },
    logoutbutton:{
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        paddingTop: 10,
        height: 44,
        width: '100%',
        backgroundColor: 'red',
        borderRadius: 6
    },
    registerEnableButtonText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'black',
        paddingTop: 10,
        height: 48,
        width: '100%',
        backgroundColor: '#FFC700',
        borderRadius: 6
    }

})
