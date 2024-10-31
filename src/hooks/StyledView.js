import React from 'react';
import { View, Text } from 'react-native';
import { s } from 'react-native-wind';

// Custom StyledView component
const StyledView = ({ className, children, ...props }) => {
    return (
        <View style={s`${className}`} {...props}>
            {children}
        </View>
    );
};

// Exporting StyledView
export default StyledView;
