import React, { Component } from 'react';
import {StyleSheet, Image, Text, View, ScrollView,TouchableHighlight,TouchableOpacity} from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {AsyncStorage} from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { PetService } from './service/PetService';
import { UserService } from './service/UserService';
class Welcome extends Component {
    database = firebase.database();
    constructor(props)
    {
        super(props);
        this.state = {
            pets:[]
        }
    }

    componentDidMount()
    {
        let self = this;
        self.getpets();
    }


    getpets = async () => {
        let self = this;


        var petsService = new PetService();
        var userService = new UserService();
        var userID = await userService.getUserID();
        var pets = [];
        
        petsService.getPets(userID, (pet) => {
            pets.push(pet);

            self.setState({
                pets:pets
            });
        });
    }

    click = (pet) => {
        
        if(this.props.navigation.state.params && this.props.navigation.state.params.addpet)
        {
            
            this.props.navigation.goBack(0);
            this.props.navigation.state.params.addpets(pet);
        }
    }

    render(){
        return(
            <ScrollView style={styles.container}>
                <View style={styles.backButtonContainer}>   
                    <Image style={{width: 44, height: 30, marginTop: 16, paddingRight: 10}} source={require('../img/logotipo.png')}></Image>                 
                    <Text style={styles.backToHomeText}>Meus Pets</Text>
                </View>
                {
                    this.state.pets.length == 0 && (
                        <View style={{paddingLeft: 16, paddingRight: 16, flex: 1}}>
                            <View>
                                <Text>Nenhum animal de estimação registrado. Por favor, adicione um novo.</Text>
                            </View>
                            <View style={styles.addNewBtnContainer}>
                                <TouchableOpacity style={styles.addNewBtnStyle} onPress={()=>this.props.navigation.navigate('RegisterPet')}>
                                    <Text style={styles.addNewBtnTextStyle}>
                                        Adicionar novo
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    )
                }
                {
                    this.state.pets.map((row,index)=>{
                        return (
                            <View key={index}>
                                <Card>
                                    <ListItem onPress={() => this.click(row)}
                                        key={row.name}
                                        roundAvatar
                                        title={
                                        <View>
                                            <Text h3 style={{fontWeight: 'bold', fontSize:20}}>
                                                {row.name}
                                            </Text>
                                        </View>}
                                        subtitle={
                                            <View>
                                                <Text>
                                                    {row.genre}
                                                </Text>
                                                <Text>
                                                    {row.pettype + " - " + row.petsize}
                                                </Text>
                                                <Text>
                                                    {row.idade} anos
                                                </Text>
                                                <Text style={{color:'red', fontSize: 20}}>
                                                    {row.obs ? row.obs : "-"}
                                                </Text>
                                            </View>
                                        }
                                        leftAvatar={{ source: { uri: row.file } }}>
                                        </ListItem>
                                        
                                    </Card>
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
        flex: 1
    },
    backButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 56,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 22
    },
    petAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        paddingLeft: 16,
        paddingRight: 16
    },
    backToHomeText: {
        fontSize: 24,
        marginTop: 16,
        marginLeft: 12,
        fontWeight: '400'
    },
    addNewBtnContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: hp('2%'),
        height: hp('6.5%')
    },
    addNewBtnStyle: {
        backgroundColor: '#FFC700',
        borderRadius: 6,
        width: '100%',
        height: hp('6.5%'),
        padding:0
    },
    addNewBtnTextStyle: {
        alignSelf: 'center',
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
    },
    boader1 :{
        backgroundColor: '#e9e9e9',
        height: 2,
        width: '100%',
        marginTop: 30
    },
    serviceTitleContainer: {
        flex: 1,
        height: 58,
        justifyContent: 'center',
        paddingLeft: 16,
        paddingRight: 16,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    serviceImgContainer1: {
        width: 126,
        marginRight: 20,
    },
    serviceText: {
        height: 48,
        justifyContent: 'center',
    }, 
    horizontalScrollView: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16
    },
    boader2 :{
        backgroundColor: '#e9e9e9',
        height: 6,
        width: '100%',
        marginTop: 31
    },
    listItemContainer1 :{
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 8,
        height: 44
    },
    listItemText1: {
        fontSize: 14,
        width: '75%',
        marginLeft: 16,
        paddingTop: 16,
        height: 44
    },
    boarder3: {
        backgroundColor: '#e9e9e9',
        height: 2,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 23
    },
    listItemImage1: {
        marginTop: 20
    }
})

const RootStack = createStackNavigator({
    servicelist: { 
        screen: Welcome,
        navigationOptions: {
            header: null
        }
    }
});
  
const AppContainer = createAppContainer(RootStack);
export default AppContainer;
