import React, { Component } from 'react';
import {StyleSheet, Image, TextInput, ScrollView, View, CheckBox, Text,TouchableHighlight,Alert, KeyboardAvoidingView} from 'react-native';
import {ImagePicker,Permissions,Constants} from 'expo';
import * as firebase from 'firebase';
import '@firebase/firestore';
import {AsyncStorage} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dropdown } from 'react-native-material-dropdown';

class RegisterPet extends Component {
    data = {};
    fileupload = false;
    constructor(props)
    {
        super(props);
        this.state = {
            data:{
                file:false,
                name:'',
                idade:'',
                petsize:'',
                pettype:"",
                genre:"",
                race:"",
                obs:""
            },
            enable:false,
            key:false     
        }
        //this.updateinfo(props);

        setTimeout(() => {
            this.getPermissionAsync();
        }, 500);
    }

    componentDidMount()
    {
        this.updateinfo(this.props);
    }

    updateinfo = (props) => {
        var data = props.navigation.getParam("data",{});

        var state = this.state.data;

        for(item in state)
        {
            if(data[item])
            {
                state[item] = data[item];
            }
        }
        
        this.setState({
            data:state,
            key:data.key?data.key:false,
            enable:this.getenable(state)
        })
        this.data = state;
    }
    imageSelect = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            alowEditing:true,
            asppect:[4,3]
        })

        
        if(!result.cancelled)
        {
            data = this.state.data;
            data.file = result.uri;
            this.fileupload = true;
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
        var ref = firebase.storage().ref('/pet').child(timestring);
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
                alert("Precisamos de acesso a sua biblioteca para buscar a foto de seu pet!");
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

    getuserid = async() => 
    {
        let userid = await AsyncStorage.getItem('userid');
        return userid;
    }

    register = async() => {
        if(this.state.enable)
        {
            var self = this;
            let data = this.state.data;
            data['userid'] = await this.getuserid();
            var db = firebase.database();
            if(this.fileupload)
            {
                this.uploadimage(data['file'],async(file)=>{
                    data['file'] = file;
                    
                    if(!self.state.key)
                    {
                        db.ref("pet").push(data);
                    }         
                    else{
                        db.ref("pet/" + self.state.key).set(data);   
                    }
                    Alert.alert("Pet cadastrado com sucesso!","Agora você já pode agendar serviços no Capital Petshop para seu Pet.",[{text:"OK",onPress:()=>self.props.navigation.goBack()}]);
                });
            }
            else
            {
                db.ref('pet/' + self.state.key).set(data);
            }
            
        }
        
    }

    settype = (value,type)=>{
        var data = this.state.data;
        if(value)
        {
            data.pettype = type
        }
        else{
            data.pettype = "";
        }

        this.setState({
            data:data,
            enable:this.getenable(data)
        });

    }
    
    render() {

        let petTypeList = [{
            value: 'Cachorro',
          }, {
            value: 'Gato',
          }];

        let petPorteList = [
              {
                value: 'Pequeno',
              }, 
              {
                value: 'Médio',
              },
              {
                value: 'Grande',
              }
        ];

        let petSexoList = [{value: 'Macho'}, {value:'Fêmea'}];

        let petDogRaceList = [
            {value: "Sem raça definida"},
            {value: "Não listado"},
            {value: "Afghan Hound"},
            {value: "Airedale Terrier"},
            {value: "Akita"},
            {value: "American Staffordshire Terrier"},
            {value: "Australian Cattle Dog (Boiadeiro Australiano)"},
            {value: "Basenji"},
            {value: "Basset Hound"},
            {value: "Beagle"},
            {value: "Bernese Mountain Dog"},
            {value: "Bichon Frisé"},
            {value: "Bloodhound"},
            {value: "Border Collie"},
            {value: "Borzoi"},
            {value: "Boston Terrier"},
            {value: "Boxer"},
            {value: "Buldogue Francês"},
            {value: "Buldogue Inglês (Bulldog)"},
            {value: "Bull Terrier"},
            {value: "Bullmastiff"},
            {value: "Cane Corso"},
            {value: "Cão de Crista Chinês"},
            {value: "Cavalier King Charles Spaniel"},
            {value: "Chihuahua"},
            {value: "Chow Chow"},
            {value: "Cocker Spaniel Americano"},
            {value: "Cocker Spaniel Inglês"},
            {value: "Collie"},
            {value: "Dachshund (Teckel)"},
            {value: "Dálmata"},
            {value: "Doberman"},
            {value: "Dogo Argentino"},
            {value: "Dogue Alemão"},
            {value: "Dogue de Bordeaux"},
            {value: "Fila Brasileiro"},
            {value: "Fox Paulistinha"},
            {value: "Golden Retriever"},
            {value: "Greyhound"},
            {value: "Griffon de Bruxelas"},
            {value: "Husky Siberiano"},
            {value: "Jack Russell Terrier"},
            {value: "Kuvasz"},
            {value: "Labrador"},
            {value: "Leão da Rodésia – Rhodesian Ridgeback"},
            {value: "Lhasa Apso"},
            {value: "Lulu da Pomerânia (Spitz Alemão Anão)"},
            {value: "Malamute do Alasca"},
            {value: "Maltês"},
            {value: "Mastiff"},
            {value: "Old English Sheepdog"},
            {value: "Papillon"},
            {value: "Pastor Alemão (Capa Preta)"},
            {value: "Pastor Australiano"},
            {value: "Pastor Belga"},
            {value: "Pastor Branco Suíço (Pastor Canadense)"},
            {value: "Pastor de Shetland"},
            {value: "Pastor Maremano Abruzês"},
            {value: "Pequinês"},
            {value: "Pinscher"},
            {value: "Pit Bull (American Pit Bull Terrier)"},
            {value: "Pointer Inglês"},
            {value: "Poodle"},
            {value: "Pug"},
            {value: "Rottweiler"},
            {value: "Samoieda"},
            {value: "São Bernardo"},
            {value: "Schnauzer Miniatura"},
            {value: "Setter Irlandês"},
            {value: "Shar Pei"},
            {value: "Shiba Inu"},
            {value: "Shih Tzu"},
            {value: "Spitz Japonês"},
            {value: "Staffordshire Bull Terrier"},
            {value: "Terra-Nova"},
            {value: "Weimaraner"},
            {value: "Welsh Corgi Cardigan"},
            {value: "Welsh Corgi Pembroke"},
            {value: "West Highland White Terrier"},
            {value: "Whippet"},
            {value: "Yorkshire Terrier"}
        ];

        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView style = {styles.container}>
                <View style={styles.backButtonContainer}>
                    <TouchableHighlight onPress={()=>this.props.navigation.goBack(0)}>
                        <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                    </TouchableHighlight>
                    
                    <Text style={styles.backToHomeText}>Cadastro Pet</Text>
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
                    <TextInput style = {styles.CPF} placeholder="Nome" placeholderTextColor="#858585" onChangeText={(value)=>this.handleChange(value,'name')} defaultValue={this.state.data.name}></TextInput>
                </View>
                <View style={styles.textInputContainer1}>
                    <TextInput keyboardType="numeric" style={styles.CPF} placeholder="Idade" placeholderTextColor="#858585"  onChangeText={(value)=>this.handleChange(value,'idade')} defaultValue={this.state.data.idade}></TextInput>
                </View>
                <View style={styles.petTypeSelectContainer}>
                    <View style={styles.petTypeSelect}>
                        <Dropdown label='Meu pet é um ' data={petTypeList} onChangeText={(text)=>{this.handleChange(text,'pettype')}}/>
                    </View>
                    <View style={styles.infoImageContainer}>
                        <Image style={styles.infoImage} source = {require('../img/info.png')}></Image>
                    </View>
                </View>
                <View style={styles.textInputContainer2}>
                    <View style={styles.petSizeSelect}>
                        <Dropdown label='Porte ' data={petPorteList} onChangeText={(text)=>{this.handleChange(text,'petsize')}}/>
                    </View>
                    <View style={styles.infoImageContainer}>
                        <Image style={styles.infoImage} source = {require('../img/info.png')}></Image>
                    </View>
                </View>

                <View style={styles.textInputContainer2}>
                    <View style={styles.petSizeSelect}>
                        <Dropdown label='Sexo ' data={petSexoList} onChangeText={(text)=>{this.handleChange(text,'genre')}}/>
                    </View>
                </View>

                <View style={styles.textInputContainer2}>
                    <View style={styles.petSizeSelect}>
                        <Dropdown label='Raça ' data={petDogRaceList} onChangeText={(text)=>{this.handleChange(text,'race')}}/>
                    </View>
                </View>

                <View style={styles.textInputContainer1}>
                    <TextInput style = {styles.CPF} placeholder="algma observação" placeholderTextColor="#858585"  onChangeText={(value)=>this.handleChange(value,'obs')} defaultValue={this.state.data.obs}></TextInput>
                </View>

                <View style={styles.registerButtonContainer}>
                    <Text style={this.state.enable?styles.registerEnableButtonText:styles.registerButtonText} onPress={this.register}>Salvar cadastro</Text>
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
        marginTop: hp('6%'),
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
        backgroundColor: '#eeeeee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        fontSize: 16,
        marginTop: 16,
        fontWeight: 'bold',
        color: '#dbdbdb'
    },
    textInputContainer: {
        marginTop: hp('3%'),
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    CPF: {
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
        fontSize: 16
    },
    textInputContainer1: {
        marginTop: hp('1.5%'),
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    petTypeSelectContainer: {
        marginTop: hp('1.5%'),
         flex: 1,
         flexDirection: 'row',
         paddingLeft: 15,
         paddingRight: 15
    },
    textInputContainer2: {
         marginTop: hp('1.5%'),
         flex: 1,
         flexDirection: 'row',
         paddingLeft: 15,
         paddingRight: 15
    },
    petTypeSelect: {
        flex: 3
    },
    petSizeSelect: {
        flex: 3
    },
    infoImageContainer: {
        flex: 1,
        width : 20,
        height: 20
    },
    infoImage: {
        marginTop: hp('2%'),
        marginLeft: wp('10%'),
        width : 20,
        height: 20
    },
    petOne: {
        width: '80%',
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#858585',
        marginRight: 37,
        fontSize: 16
    },
    typeContainer : {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 24,
        height: 48
    },
    registerButtonContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: hp('1.5%'),
        marginBottom: hp('1.5%'),
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

export default RegisterPet;