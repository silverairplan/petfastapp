import React, { Component } from 'react';
import {StyleSheet, Image, TextInput, ScrollView, View, Text, Switch,TouchableHighlight,CheckBox,Button,TouchableOpacity,DatePickerAndroid,TimePickerAndroid} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {ImagePicker,Permissions,Constants} from 'expo';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, DrawerActions } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ServiceConfirm from './ConfirmServices';
import AddAddress from './RegisterAddress';
import ServiceList from './ServiceList';
import Summary from './Summary';
import Checkout from './Checkout';
import CheckoutSuccess from './CheckOutSuccess';
import first from './ServiceScheduled';
import Pets from './Pets';
import * as firebase from 'firebase';
import '@firebase/firestore';
import {AsyncStorage} from 'react-native';
import Toast from 'react-native-easy-toast';
import { Dropdown } from 'react-native-material-dropdown';
import { Service } from './service/Service';
import { UserService } from './service/UserService';

class Services extends React.Component {
    firebase = firebase.database();
    constructor(props) {
        super(props);
        this.state = {
            switchValue: false,
            position:false,
            data:{
                date: this.getDefaultDateForPicker(),
                time:"",
                pets:[],
                position:"",
            },
            positionObjData:[],
            positiondata:[],
            positionSelected:null,
            enable: false,
            serviceTotal: 0,
            extraServices:[],
            extraServicesFullList:[],
            taxiDogService:null
        };

        new Service().getServiceInfo((item) => 
        {
            this.state.extraServicesFullList.push(item);

            //removed taxi dog to put it manually
            if(item.service.toLowerCase() === "extra" && item.name.toLowerCase() !== "taxi dog")
                this.state.extraServices.push(this.copyServiceInfo(item));
        });

    }

    //copy and create a new prop to set it as selected or not
    copyServiceInfo  = (item) =>
    {
        return {
            selected:false,
            key : item.key,
            name : item.name,
            description : item.description,
            file : item.file,
            param : item.param,
            pricelist : item.pricelist,
            service : item.service
        }
    }

    //tell what date should appear in component.
    //If time is greater than 17h, set date for next day
    getDefaultDateForPicker()
    {
        const date = new Date();
        
        if(date.getHours() >= 17 || (date.getHours() >= 16 && date.getMinutes() >= 45))
        {
            date.setDate(date.getDate() + 1);
            return date;
        }
        return date;
    }

    //allow to users make an appointment in max 15 days
    getMaxDateForPicker()
    {
        const date = new Date();
        date.setDate(date.getDate() + 15);
        return date;
    }

    validate = (data) => {
        var enable = true;
        for(let item in data)
        {
            if(item == 'position')
            {
                continue;
            }

            if(Array.isArray(data[item]))
            {
                if(data[item].length == 0)
                {
                    enable = false;
                    break;
                }
            }
            else
            {
                if(!data[item])
                {
                    enable = false;
                    break;
                }
            }
        }

        this.setState({enable:enable});
    }

    componentDidMount()
    {
        this.updateinfo();
    }
    imagepicker = () => {
       this.props.navigation.navigate("pets",{addpets:this.addpets,addpet:true});
    }
    
    updateinfo = async() => {
        
        self = this;
        let userid = await this.getuserid();

        var userService = new UserService();
        var addressesFormatted = [];
        var addresses = [];
        userService.getUserAddress(userid, (address) => 
        {
            addressesFormatted.push(
                {
                    value: address.descendereco ? address.descendereco : address.end + " - " + address.bair + " - " + address.num
                }
            );
            addresses.push(address);
            
            self.setState({
                positiondata:addressesFormatted,
                positionObjData:addresses
            });
        });
    }

    getuserid = async() => {
        let userid = await AsyncStorage.getItem('userid');
        return userid;
    }

    addpets = (pets) => 
    {
        let data = this.state.data;
        
        //pet already added
        const currentPet = data.pets.find(p => {return p.key === pets.key;});
        if (currentPet)
        {
            this.refs.toast.show(currentPet.name + ' já está na lista de agendamento! 😀', 1000, ()=> {});
            return;
        }
            
        data.pets.push(pets);
        this.recalculateTotalService();

        this.validate(data);
        this.setState({data:data});
    }

    recalculateTotalService = () =>
    {
        
        this.state.serviceTotal = 0;

        //check the taxi dog
        if(this.state.taxiDogService)
        {
            this.state.serviceTotal += this.state.taxiDogService.pricelist.p;
        }

        //calculate service value
        const objData = this.props.navigation.getParam("service");

        this.state.data.pets.forEach(pet => 
        {
            if(pet.petsize.toLowerCase() === "pequeno")
            {
                this.state.serviceTotal += objData.pricelist.p;
            }
            
            if(pet.petsize.toLowerCase() === "médio")
            {
                this.state.serviceTotal += objData.pricelist.m;
            }

            if(pet.petsize.toLowerCase() === "grande")
            {
                this.state.serviceTotal += objData.pricelist.g;
            }
        });

        //add extra service values
        this.state.extraServices.forEach(service => 
            {
                if(!service.selected) return;
                //verify pets qty
                this.state.data.pets.forEach(pet => 
                    {
                        if(pet.petsize.toLowerCase() === "pequeno")
                        {
                            this.state.serviceTotal += service.pricelist.p;
                        }
                        
                        if(pet.petsize.toLowerCase() === "médio")
                        {
                            this.state.serviceTotal += service.pricelist.m;
                        }

                        if(pet.petsize.toLowerCase() === "grande")
                        {
                            this.state.serviceTotal += service.pricelist.g;
                        }
                    });
            });
    }

    

    changeTaxiDog = (value) => 
    {

        if(value)
        {
            var item = this.state.extraServicesFullList.find(item => item.name.toLowerCase() === "taxi dog");
            this.state.taxiDogService = item;
        }
        else
            this.state.taxiDogService = null;

        this.recalculateTotalService();

        this.setState(prevState => {
            return {
                switchValue:!prevState.switchValue
            }
        })
    }


    positionselect = (value, index, dataObj) => {
        
        var data = this.state.data;
        if(value)
        {
            data.position = value;
            this.state.positionSelected = this.state.positionObjData[index];
        }
        
        this.setState(prevState => {
            return {
                data:data,
                position:value,
                positionSelected:this.state.positionObjData[index]
            }
        });
    }


    location = (data) =>{
        let position = this.state.positiondata;
        position.push(data.end);
        this.setState({
            positiondata:position
        })
    }

    scheduleService = () => 
    {
        if(this.state.enable)
        {
            var data = this.state.data;
            
            var paramObject = { 
                dateSchedule: data.date,
                timeSchedule:data.time,
                pets:data.pets,
                mainService: this.props.navigation.getParam("service", { }),
                services: this.state.extraServices.filter(a => a.selected === true),
                taxiDogService : this.state.taxiDogService,
                serviceTotal: this.state.serviceTotal,
                pickupAddress: this.state.positionSelected
            };

            
            this.props.navigation.navigate("summary", paramObject);
        }
    }

    render() {
        let confirmbtn = {
            backgroundColor: '#FFC700',
            borderRadius: 6,
            width: '100%',
            height: 48,
            padding:0
        }
    
    if(!this.state.enable)
    {
        confirmbtn.backgroundColor = "#e5e5e5";
    }



        return(
            <ScrollView style = {styles.container}>
                
                <Toast ref="toast" position= "bottom"/>

                <View style={styles.backButtonContainer}>
                    <TouchableHighlight  onPress={()=>this.props.navigation.goBack(0)}>
                        <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                    </TouchableHighlight>
                    <Text style={styles.backToHomeText}>Serviços</Text>
                </View>

                <View style={styles.serviceImgContainer}>
                    <Image style={styles.serviceImg1} source={{uri:this.props.navigation.getParam("service",{}).file}}></Image>
                </View>

                <View style={styles.serviceTitleContainer}>
                    <Text style={styles.serviceTitleText}>{this.props.navigation.getParam("service",{}).name}</Text>
                </View>

                <View style={styles.serviceContentContainer}>
                    <Text style={styles.serviceContentText}>
                    {this.props.navigation.getParam("service",{}).description}
                    </Text>
                </View>

                <View style={styles.choosePetTitleContainer}>
                    <Text style={styles.choosePetTitle}>Escolha o pet</Text>
                </View>

                <ScrollView style={styles.horizontalScrollView} horizontal='true'>
                    <View style={styles.addPetContainer}>
                        {
                            this.state.data.pets.map((row,index)=>{
                                return (
                                    <Image key={"image_" + index} style={{width:70,height:70, borderRadius: 35, marginLeft: 6}} source={{uri:row.file}}></Image>
                                )
                            })
                        }
                        <TouchableHighlight onPress={this.imagepicker}>
                            <Image style={{width: 70, height: 70, marginLeft: 6}} source={require('../img/add_pet.png')}></Image>
                        </TouchableHighlight>
                    </View>
                </ScrollView>

                <View style={styles.choosePetTitleContainer}>
                    <Text style={styles.choosePetTitle}>Escolha o dia e hora</Text>
                </View>
                
                <View style={styles.chooseDayContainer}>

                    <View style={{flex: 1, borderBottomColor:'#d3d3d3', borderBottomWidth: 1}}>
                        <DatePicker ref="dpDate" maxDate={this.getMaxDateForPicker().toLocaleDateString()} minDate={this.getDefaultDateForPicker().toLocaleDateString()} date={this.state.data.date} showIcon={true} placeholder="Escolha um dia" mode="date" format="DD/MM/YYYY"
                            customStyles={{
                                dateInput: {
                                borderWidth: 0,
                                height: 50,
                                width: wp('30%'),
                                right: 2,
                                },
                                dateText: {
                                marginTop: 5,
                                color: '#000',
                                fontSize: 16,
                                },
                                placeholderText: {
                                marginTop: 5,
                                right: 2,
                                color: '#858585',
                                fontSize: 14,
                                }}}  onDateChange={(date) => { var data = this.state.data; data.date = date; this.validate(data); this.setState({data:data}); }} placeholderTextColor="#abc" underlineColorAndroid={'rgba(0,0,0,0)'} 
                                style={{ height: 50, width: wp('42%'), paddingLeft: 4}} confirmBtnText="Confirm" cancelBtnText="Cancel"></DatePicker>
                    </View>
                    
                    <View style={{flex: 1, borderBottomColor:'#d3d3d3', borderBottomWidth: 1, marginLeft: 25}}>
                        <DatePicker date={this.state.data.time} minuteInterval={30} minDate="09:00" maxDate="17:00" showIcon={true} placeholder="Escolha o horário" mode="time" 
                            customStyles={{
                                dateInput: {
                                borderWidth: 0,
                                height: 50,
                                width: wp('42%'),
                                right: 2,
                                },
                                dateText: {
                                marginTop: 5,
                                color: '#858585',
                                fontSize: 16,
                                },
                                placeholderText: {
                                marginTop: 5,
                                right: 2,
                                color: '#858585',
                                fontSize: 14,
                                }}}  
                                onDateChange={(date) => {
                                    var data = this.state.data; 
                                    
                                    data.time = date; 
                                    this.validate(data); 
                                    this.setState({data:data}); 

                                }} placeholderTextColor="#abc" underlineColorAndroid={'rgba(0,0,0,0)'} 
                                style={{ height: 50, width: wp('44%'), paddingLeft: 4}} confirmBtnText="Confirmar" cancelBtnText="Cancelar"></DatePicker>
                    </View>                
                </View>

                <View style={styles.optionalTitleContainer}>
                    <Text style={styles.choosePetTitle}>Serviços extras</Text>
                </View>

                {
                    //try to ensure that data are fetched
                    this.state.extraServices.map((row, index) =>
                    {
                            return (
                                <View key={"extrasrv_" + index} style={styles.switchContainer}>
                                    <Switch key={"switch" + index} style={{flex: 1, marginLeft: 0}} onValueChange={ 
                                        () => 
                                        { 
                                            if(index == -1) return;
                                            
                                            this.state.extraServices[index].selected = !this.state.extraServices[index].selected;
                                            this.setState(() => { this.state.extraServices});
                                            this.recalculateTotalService(); 

                                            this.forceUpdate();
                                        }
                                    } 
                                    value={ this.state.extraServices[index].selected }></Switch>
                                    <Text style={styles.pickupServiceText}>{row.name}</Text>
                                    <View style={{flex: 1, marginLeft: wp('10%'),marginTop: hp('2.5%'), width : 20, height: 20}}>
                                        <Image style={styles.infoImage} source = {require('../img/info.png')}></Image>       
                                    </View>
                                </View>
                            )
                    })
                }

                <View style={styles.switchContainer}>
                    <Switch style={{flex: 1, marginLeft: 0}} onValueChange={this.changeTaxiDog} value={this.state.switchValue}></Switch>
                    <Text style={styles.pickupServiceText}>Taxi Dog</Text>
                    <View style={{flex: 1, marginLeft: wp('10%'),marginTop: hp('2.5%'), width : 20, height: 20}}>
                        <Image style={styles.infoImage} source = {require('../img/info.png')}></Image>       
                    </View>
                </View>
                {
                    this.state.switchValue && (
                        <View>
                            <View style={styles.optionalTitleContainer}>
                                <Text style={styles.choosePetTitle}>Onde devemos buscar seu pet?</Text>
                            </View>
                            
                            <View style={styles.addressSelectContainer}>
                                <Dropdown style={{paddingLeft: 15, paddingRight: 15, flex: 1}} label='Endereço' data={this.state.positiondata} 
                                        onChangeText={
                                            (value, index, data)=>
                                                {
                                                    this.positionselect(value, index, data)
                                                }
                                            }/>
                            </View>

                            <View style={styles.optionalTitleContainer}>
                                <Text style={styles.choosePetTitle} onPress={()=>this.props.navigation.navigate("addlocation",{location:this.location})}>+    Cadastrar um novo endereço</Text>
                            </View>         
                        </View>
                    )
                }
                <View style={styles.confirmCheckoutContainer}>
                    <Text style={{marginTop: 40, fontSize: 24, paddingLeft: 15, paddingRight: 50}}>
                            R$ <Text>{this.state.serviceTotal}</Text>
                    </Text>
                    <View style={styles.signUpButtonContainer}>
                        <TouchableOpacity style={confirmbtn}   
                            onPress={()=> this.scheduleService()}>
                            <Text style={styles.signUpButtonTextStyle}>
                                Continuar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButtonContainer: {
        height: 60,
        flexDirection: 'row',
        marginTop: 44,
        paddingLeft: 18,
    },
    backButton: {
        width: 16,
        height: 16,
        marginLeft: 3,
        marginRight: 28,
        marginTop: 22
    },
    signUpButtonContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 36,
        height: 44,
        paddingLeft: 15,
        paddingRight: 15
    },
    signUpButtonStyle: {
        backgroundColor: '#FFC700',
        borderRadius: 6,
        width: '100%',
        height: 44,
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
    backToHomeText: {
        fontSize: 16,
        marginTop: 22
    },
    serviceImgContainer: {
        flex:1,
        width: wp('93%'),
        height: hp('24%'),
        paddingLeft: 15,
        paddingRight: 15,
    },
    serviceImg1: {
        width: wp('100%'),
        height: hp('24%'),
        borderRadius: 6,
        resizeMode: 'contain'
    },
    serviceTitleContainer: {
        flex: 1,
        height: 60,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center'
    },
    serviceTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff4d00'
    },
    serviceContentContainer: {
        flex:1,
        paddingLeft: 15,
        paddingRight: 15
    },
    serviceContentText: {
        fontSize: 14,
        lineHeight: 18,
        color: '#858585',
        letterSpacing: 0.5

    },
    serviceTimeContainer: {
        flex: 1,
        height: 54,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center'
    },
    serviceTimeText: {
        fontSize: 14,
        lineHeight: 18
    },
    choosePetTitleContainer: {
        flex: 1,
        height: 48,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center'
    },
    choosePetTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 18
    },
    addPetContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    chooseDayContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 48,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center'
    },
    startDateContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    startDate: {
        width: '90%',
        height: 48,
        borderBottomColor: '#858585',
        borderBottomWidth: 1,
    },
    addressSelectContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    optionalTitleContainer: {
        flex: 1,
        height: 48,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: hp('2%'),
        justifyContent: 'center'
    },
    switchContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        height: 48,
    },
    pickupServiceText: {
        flex: 3,
        height: 48,
        fontSize: 16,
        paddingTop: 15,
        marginLeft: wp('6%')
    },
    infoImage: {
        flex: 1,
        width: 20,
        height: 20,
        
    },
    horizontalScrollView: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16
    },
    positionselect:{
        flex:1,
        flexDirection:'row',
        paddingLeft:15,
        paddingRight:15,
        alignItems:"center"
    },
    confirmCheckoutContainer: {
        flex:1,
        flexDirection:'row',
        marginBottom: 16
    }
})

const RootStack = createStackNavigator({
    services: { 
        screen: Services,
        navigationOptions: {
            header: null
        }
    },
    confirm_services:{
        screen:ServiceConfirm,
        navigationOptions: {
            header: null
        }
    },
    addlocation:{
        screen:AddAddress,
        navigationOptions: {
            header: null
        }
    },
    servicelist:{
        screen:ServiceList,
        navigationOptions: {
            header: null
        }
    },
    summary:{
        screen:Summary,
        navigationOptions: {
            header: null
        }
    },
    selectpayment:{
        screen:Checkout,
        navigationOptions: {
            header: null
        }
    },
    confirmcheckout:{
        screen:CheckoutSuccess,
        navigationOptions: {
            header: null
        }
    },
    scheduled:{
        screen:first,
        navigationOptions: {
            header: null
        }
    },
    pets:{
        screen:Pets,
        navigationOptions: {
            header: null
        }
    }
});
  
const AppContainer = createAppContainer(RootStack);
export default AppContainer;