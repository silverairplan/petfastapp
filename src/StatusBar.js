import React, { Component } from 'react';
import {StyleSheet, Image, Text, View, ScrollView, TouchableOpacity, StatusBar} from 'react-native';

class Welcome extends Component {
    render(){
        return(
            <ScrollView style={styles.container}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#abc" translucent={true}></StatusBar>
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