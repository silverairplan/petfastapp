import React, { Component } from 'react';
import {StyleSheet, Text, Image, View, ScrollView, Alert, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { AsyncStorage } from 'react-native';
import { AgendaService } from './service/AgendaService';
import { UserService } from './service/UserService';
class Agenda extends Component {
    firebase = firebase.database();
    constructor(props)
    {
        super(props);
        this.state = {
            pets:[],
            agendaList: []
        }

        const agendaService = new AgendaService();
        const userService = new UserService();

        userService.getUserID()
            .then(userID => 
                {
                    const self = this;
                    const tmpAgendaList = [];
                    agendaService.getAgendaList(userID, (agenda) =>
                    {
                        tmpAgendaList.push(agenda);
                        self.setState({ agendaList:tmpAgendaList });
                    });
                })
    }
    componentDidMount()
    {
        this.updateinfo()
    }

    getpets = async() => {
        let self = this;
        let userid = await this.getuserid();
        
        return new Promise((resolve,reject)=>{
            self.firebase.ref("/pet").on('value',snapshot=>{
                let data = [];
                snapshot.forEach(c=>{
                    let value = c.val();
                    if(value.userid == userid)
                    {
                        let value = c.val();
                        value.key = c.key;
                        data.push(value);
                    }
                    
                })
                resolve(data);
            })
        })
    }

    updateinfo = async() => {
        let userid = await this.getuserid();
        let pets = await this.getpets();
        
        var data = [];
        let self = this;
        this.firebase.ref('/userservice').on('value',snapshot=>{
            snapshot.forEach(c=>{
                let value = c.val();
                if(value.userid == userid)
                {
                    for(let item in value.pets)
                    {
                        for(let itempets in pets)
                        {
                            if(value.pets[item] == pets[itempets].key)
                            {
                                let dataitem = c.val();
                                dataitem.key = c.key;
                                dataitem.pets = pets[itempets];
                                data.push(dataitem);
                                break;
                            }
                        }
                    }
                }
            })

            
            self.setState({
                pets:data
            })
        })
    }

    getuserid = async() => {
        let userid = await AsyncStorage.getItem('userid');
        return userid;
    }

    deletefunction = (data,index) =>
    {

        Alert.alert(
            'Cancelar um serviço 😕',
            'Confirma o cancelamento deste Serviço?',
            [
              {text: 'Não! Manter o agendamento', onPress: () => {}},
              {
                text: 'Sim! Pode cancelar',
                onPress: () => { this.delete(data,index) },
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );

        
    }
    delete = (data,index) => {
        let self = this;
        
        this.firebase.ref('/userservice/' + data.key).on('value',snapshot=>{
            snapshot.forEach(c=>{
                let value = c.val();
                console.log(value.pets);
            })

            let pets = self.state.pets;
            pets.splice(index,1);
            self.setState({
                pets:pets
            })
        })
    }
    render(){
        return(
            <ScrollView style={styles.container}>
                <Text style={{marginTop: 44, height: 78, paddingTop: 27, paddingLeft: 15, paddingRight: 15, fontSize: 24}}>Agenda</Text>
                <View style={styles.agendaTextContainer}>
                    <Text style={{fontWeight: 'bold', fontSize: 12, marginTop: 18, paddingLeft: 15, paddingRight: 15}}>Em caso de cancelamentos</Text>
                    <Text style={{color: '#858585', fontSize: 12, lineHeight: 14, paddingLeft: 15, marginTop: 8 }}>O cancelamento é permitido em até 24h antes do horário de{'\n'}serviço. Qualquer 
                    dúvida,<Text style={{color: '#ff4000', fontWeight: 'bold'}}> liga pra gente!</Text> 
                    </Text>
                </View>
                {
                    
                    this.state.agendaList.map((row,index)=>{
                        return (
                            <View key={index}>

                                <View style={styles.detailContainer}>
                                    <Text style={{fontSize: 14, fontWeight: 'bold', color: '#ff4000'}}>{row.datescheduled}{'\n'}<Text style={{color: '#000', fontSize: 14, }}>{row.service}</Text></Text>
                                    <Text style={{fontSize: 14, color: '#858585', marginLeft: 30}}>Horário:{'\n'}<Text style={{color: '#000', fontSize: 14, }}>{row.timescheduled}</Text></Text>
                                    <Text style={{color: '#ff4000', marginLeft: 120, marginRight:10 }} onPress={()=>this.deletefunction(row,index)}>Cancelar</Text>
                                </View>

                                {
                                    row.petsList.map((rowpet, index) => 
                                    {
                                        return (
                                            <View key={rowpet.name} style={styles.petItemContainer}>
                                                <Image source={{uri:rowpet.file}} style={{width: 70, height: 70, borderRadius: 30}}></Image>
                                                <Text style={{fontSize: 24, marginLeft: 18, height: 54, paddingTop: 15}}>{rowpet.name}</Text>
                                            </View>
                                        )
                                    })
                                }

                                {
                                    row.serviceList.map((rowservice, index) =>
                                    {
                                        return (
                                            <View key={rowservice.name + index}>
                                                <Text style={{fontSize: 24, marginLeft: 18, height: 54, paddingTop: 15}}>{rowservice.name}</Text>
                                            </View>
                                        )
                                    })
                                }

                            </View>
                        )
                    })
                }
               
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    agendaTextContainer: {
        flex: 1,
        height: 84,
        backgroundColor: '#efefef'
    },
    petItemContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 15
    },
    detailContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 19
    }
})

export default Agenda; 