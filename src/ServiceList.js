import React, { Component } from 'react';
import {StyleSheet, Image, Text, View, ScrollView,TouchableHighlight} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
class Welcome extends Component {
    render(){
        return(
            <ScrollView style={styles.container}>
                <View style={styles.backButtonContainer}>
                    <TouchableHighlight onPress={()=>this.props.navigation.navigate(0)}>
                        <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                    </TouchableHighlight>
                    
                    <Text style={styles.backToHomeText}>Lista de serviços</Text>
                 </View>
                <View style={styles.listItemContainer1}>
                    <Text style={styles.listItemText1}>Banho</Text>
                    <TouchableHighlight onPress={()=>this.props.navigation.navigate('services')}>
                        <Image style={styles.listItemImage1} source={require('../img/arrow_forward.png')}></Image>
                    </TouchableHighlight>
                </View>
                <View style={styles.boarder3}></View>
                <View style={styles.listItemContainer1}>
                    <Text style={styles.listItemText1}>Tosa</Text>
                    <TouchableHighlight onPress={()=>this.props.navigation.navigate('services')}>
                        <Image style={styles.listItemImage1} source={require('../img/arrow_forward.png')}></Image>
                    </TouchableHighlight>
                </View>
                <View style={styles.boarder3}></View>
                <View style={styles.listItemContainer1}>
                    <Text style={styles.listItemText1}>Banho e tosa</Text>
                    <TouchableHighlight onPress={()=>this.props.navigation.navigate('services')}>
                        <Image style={styles.listItemImage1} source={require('../img/arrow_forward.png')}></Image>
                    </TouchableHighlight>
                </View>
                <View style={styles.boarder3}></View>
                <View style={styles.listItemContainer1}>
                    <Text style={styles.listItemText1}>Atendimento veterinário</Text>
                    <TouchableHighlight onPress={()=>this.props.navigation.navigate('services')}>
                        <Image style={styles.listItemImage1} source={require('../img/arrow_forward.png')}></Image>
                    </TouchableHighlight>
                </View>
                <View style={styles.boarder3}></View>
                <View style={styles.listItemContainer1}>
                    <Text style={styles.listItemText1}>Hotel</Text>
                    <TouchableHighlight onPress={()=>this.props.navigation.navigate('services')}>
                        <Image style={styles.listItemImage1} source={require('../img/arrow_forward.png')}></Image>
                    </TouchableHighlight>
                </View>
                <View style={styles.boarder3}></View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    
    boader1 :{
        backgroundColor: '#e7e7e7',
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
        backgroundColor: '#e7e7e7',
        height: 6,
        width: '100%',
        marginTop: 8
    },
    listItemContainer1 :{
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 23,
        marginBottom: 23
    },
    listItemText1: {
        fontSize: 14,
        width: '95%'
    },
    boarder3: {
        backgroundColor: '#dcdcdc',
        height: 2,
        marginLeft: 15,
        marginRight: 15
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
