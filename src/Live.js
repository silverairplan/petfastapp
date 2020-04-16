import React, { Component } from 'react';
import {StyleSheet, Image, Text, View, ScrollView, TouchableOpacity, StatusBar} from 'react-native';

class Welcome extends Component {
    render(){
        return(
            <ScrollView style={styles.container}>
                <View style={styles.backButtonContainer}>
                    <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                 </View>
                 <View style={styles.livePetContainer}>
                    <Image style={{width: '100%'}} source={require('../img/live_img.png')}></Image>
                 </View>
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
    livePetContainer: {
        flex: 1
    }
})

export default Welcome;