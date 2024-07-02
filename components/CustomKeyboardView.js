import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'

export default function CustomKeyboardView({children}) {
  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{flex: 1}}>
        <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
            {children}
        </ScrollView>
    </KeyboardAvoidingView>
  )
}