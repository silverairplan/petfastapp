import React, { Component } from 'react';
import {StyleSheet, Image, ScrollView, View, Text, Switch,TouchableHighlight} from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import {AsyncStorage} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { UserService } from './service/UserService';

class Services extends Component {
    servicedata = {};
    constructor(props) {
        super(props);
        this.state={
            switchValue: false,
            totalervice:0,
            services:[],
            pets:[],
            payment:[],
        }
    }

    addValue = (item) => {
        tip = this.state.tip;
        tip[item].value ++;
        this.setState({
            tip:tip
        })
    }
    

    selectpayment = (data) => {
        let payment = this.state.payment;
        
        payment.push(data);
        this.setState({
            payment:payment
        })
    }

    setpayment = (value,payment) => {
        
        if(value)
        {
            this.setState({
                paymentvalue:value
            })
        }
        else
        {
            this.setState({
                paymentvalue:''
            })
        }
    }

    scheduleService = async() => 
    {
        
        const params = this.props.navigation.state.params;

        let userid = await new UserService().getUserID();

        const scheduleServiceInfo = 
        {
            datescheduled : params.dateSchedule,
            timescheduled : params.timeSchedule,
            userid: userid,
            pets:[],
            services:[],
            paymentmethod: this.state.paymentvalue,
            pickupaddress: params.pickupAddress,
            status:"01",
            scheduledon : new Date(),
            cancelledon : null
        }

        for (let index = 0; index < params.pets.length; index++) {
            scheduleServiceInfo.pets.push(params.pets[index].key);
        }

        //verify if there is taxi dog service
        if(params.taxiDogService)
            scheduleServiceInfo.services.push(params.taxiDogService.key);

        //add the main service to the list
        scheduleServiceInfo.services.push(params.mainService.key);

        for (let index = 0; index < params.services.length; index++) {
            scheduleServiceInfo.services.push(params.services[index].key);
        }

        let database = firebase.database();
        database.ref("/userservice").push(scheduleServiceInfo)
            .then(ref => 
                {
                    //ref.key
                    //aguarde, fazendo sua transação
                    this.props.navigation.navigate("confirmcheckout");
                });
    }

    render() {

        paymentFormList = [
            {
                value:"Cartão Final *5690",
                key:"card1"
            },
            {
                value:"Maquininha - Débito ou Crédito",
                key: "maq_deb_cred"
            },
            {
                value:"Dinheiro",
                key:"dinheiro"
            },
        ];

        return(
            <ScrollView style = {styles.container}>
                <View style={styles.backButtonContainer}>
                    <TouchableHighlight onPress={()=>this.props.navigation.goBack()}>
                        <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                    </TouchableHighlight>
                    <Text style={styles.backToHomeText}>Resumo</Text>
                 </View>
                 <View style={{paddingLeft: 15, paddingRight: 15, height: 48}}>
                     <Text style={{fontWeight: 'bold', lineHeight: 14, fontSize: 12, paddingTop: 11}}>{this.props.navigation.state.params.mainService.name}</Text>
                 </View>
                 <View style={styles.detailsContainer}>
                    <Text>
                         <Text>Agendado para dia </Text>
                        {this.props.navigation.state.params.dateSchedule}
                     </Text>
                     <Text>
                         <Text> às </Text>
                         {this.props.navigation.state.params.timeSchedule}
                     </Text>
                 </View>
                 <View style={styles.totalContainer}>
                    <Text style={styles.totalPriceText}>Total: <Text style={{fontWeight:'bold'}}>R$ {this.props.navigation.state.params.serviceTotal}</Text></Text>
                 </View>
                 <View >
                    <Text style={styles.listItemText1}>Como gostaria de Pagar?</Text>
                    <Dropdown label='escolha ' data={paymentFormList} onChangeText={(text)=>{
                        this.setpayment(text,'paymentForm')}}/>
                </View>

                <View style={styles.confirmButtonContainer}>
                    <Text style={this.state.paymentvalue?styles.confirmEnableButton:styles.confirmButton} onPress={this.scheduleService}>Agendar Serviço</Text>
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
    backToHomeText: {
        fontSize: 16,
        marginTop: 22
    },
    detailsContainer: {
        flex:1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    totalContainer: {
        flex: 1,
        width: '100%',
        height: 60,
        borderTopColor: '#cecece',
        borderTopWidth: 1,
        borderBottomColor: '#cecece',
        borderBottomWidth: 1,
        backgroundColor: '#efefef',
        marginTop: 12
    },
    totalPriceText: {
        fontSize: 18,
        marginLeft: 15,
        marginTop: 16
    },
    listItemContainer1 :{
        flex: 1,
        flexDirection: 'row',
        height: 60,
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 18,
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 1
    },
    listItemText1: {
        paddingTop: 14,
        fontSize: 16,
        width: '95%'
    },
    buyTextContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        height: 48
    },
    buyText: {
        fontSize: 14,
        paddingTop: 17, 
        fontWeight: 'bold'
    },
    dogCollarContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    dogCollarItemContainer1: {
        flex: 1,

    },
    confirmButtonContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 12,
        marginBottom: 18
    },
    confirmButton: {
        textAlign: 'center',
        paddingTop: 12,
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        height: 48,
        width:'100%',
        color: '#000',
        borderRadius: 6,
        backgroundColor: '#ffc700',
    },
    confirmEnableButton: {
        textAlign: 'center',
        paddingTop: 12,
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        height: 48,
        width:'100%',
        color: '#000',
        borderRadius: 6,
        backgroundColor: '#FFC700',
    },
    actionicon:{
        flex:1,
        flexDirection:"row",
        marginTop:10
    },
    icons:{
        width:"40%",
        textAlign:"center"
    }
})

export default Services;