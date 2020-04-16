import React, { Component } from 'react';
import {StyleSheet, Image, TextInput, ScrollView, View, Text, Switch,TouchableHighlight} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import ServiceList from './ServiceList';
import Checkout from './Summary';
class Services extends Component {
    
    render() {
        return(
            <ScrollView style = {styles.container}>
                <View style={styles.backButtonContainer}>
                    <TouchableHighlight onPress={()=>{this.props.navigation.goBack(0)}}>
                        <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                    </TouchableHighlight>
                    
                    <Text style={styles.backToHomeText}>Confirmar serviço</Text>
                 </View>
                 <View style={styles.serviceDescriptionContainer}>
                    <Text style={styles.servieDescriptionText}>Descrição do serviço</Text>
                 </View>
                 <View style={{paddingLeft: 15, paddingRight: 15, height: 48}}>
                     <Text style={{fontWeight: 'bold', lineHeight: 14, fontSize: 12, paddingTop: 11}}>{this.props.navigation.state.params.service.name} - ({this.props.navigation.state.params.data.pets[0].name}){'\n'}Porte Grande</Text>
                 </View>
                 <View style={styles.detailsContainer}>
                    <Text style={{flex: 1, height: 48}}>Dia:{'\n'}{this.props.navigation.state.params.data.date}</Text>
                    <Text style={{flex: 1, height: 48}}>Horário:{'\n'}{this.props.navigation.state.params.data.time}</Text>
                    <Text style={{flex: 1, height: 48}}>Valor:{'\n'}R$ {this.props.navigation.state.params.service.price}</Text>
                 </View>
                 <View style={styles.totalContainer}>
                    <Text style={styles.totalPriceText}>Total: <Text style={{fontWeight:'bold'}}>R$ {this.props.navigation.state.params.service.price}</Text></Text>
                 </View>
                 {/* Disabled for now */}
                 {/* <View style={styles.listItemContainer1}>
                    <Text style={styles.listItemText1}>Adicionar outro serviço</Text>
                    <TouchableHighlight onPress={()=>this.props.navigation.navigate("servicelist")}>
                        <Image style={{marginTop: 14}} source={require('../img/arrow_forward.png')}></Image>
                    </TouchableHighlight>
                    
                </View> */}
                <View style={styles.confirmButtonContainer}>
                    <Text style={styles.confirmButton} onPress={()=>this.props.navigation.navigate("summary",this.props.navigation.state.params)}>Escolher pagamento</Text>
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
    serviceDescriptionContainer: {
        flex: 1,
        height: 36,
        marginLeft: 16,
        marginRight: 16,
    },
    servieDescriptionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff4d00',
        paddingTop: 11
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
        backgroundColor: '#efefef'
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
    confirmButtonContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 36
    },
    confirmButton: {
        textAlign: 'center',
        paddingTop: 12,
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        height: 48,
        width:'100%',
        borderRadius: 6,
        backgroundColor: '#ffc700',
    }
})

export default Services;
