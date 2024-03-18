import { ReactNode } from 'react';
import { Text as ReactText, StyleProp, TextStyle } from 'react-native';
import { Colors, fontSizes, fontWeights } from './Constants';

// todo: find good typescripty way to share these enums w/ corresponding Constants 
type TextWeight = 'medium' | 'regular' | 'light';
type TextSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
type TextColors = 'text' | 'background';

// todo: figure out the style typing, does not feel worth fighting with right now :)
type TextProps = {
    weight?: TextWeight
    size?: TextSize
    style?: any
    color?: TextColors
    children: ReactNode | string
}

export const Text = ({ weight = 'regular', size = 's', style = {}, color = 'text', children }: TextProps) => {
    const textStyle = {
        fontFamily: fontWeights[weight],
        fontSize: fontSizes[size],
        color: Colors[color],
    };

    return (
        <ReactText
            style={{ ...textStyle, ...style }}
        >
            {children}
        </ReactText >
    )
}