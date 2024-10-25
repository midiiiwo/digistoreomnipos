// BackOfficeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const BackOfficeScreen = () => {
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: 'https://dashboard.ipaygh.com/' }} // Replace with your desired URL
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});

export default BackOfficeScreen;
