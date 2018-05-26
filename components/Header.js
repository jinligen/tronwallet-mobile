import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import * as Utils from './Utils'
import { Colors } from './DesignSystem'

const Header = ({
  title,
  description,
  onLeftPress = null,
  onRightPress = null,
  leftIcon = <Text style={{ color: Colors.primaryText }}>BACK</Text>,
  rightIcon = <Text style={{ color: Colors.primaryText }}>RIGHT</Text>,
  children
}) => {
  const placeholder = <View />

  const leftBtn = onLeftPress ? (
    <TouchableOpacity onPress={onLeftPress}>
      {leftIcon}
    </TouchableOpacity>
  ) : placeholder

  const rightBtn = onRightPress ? (
    <TouchableOpacity onPress={onRightPress}>
      {rightIcon}
    </TouchableOpacity>
  ) : placeholder

  return (
    <Utils.Content>
      <Utils.Row align='center' justify='space-between'>
        {leftBtn}
        {children}
        {/* <Utils.View align='center'>
          <Utils.Text size='xsmall' secondary>{title}</Utils.Text>
          <Utils.Text size='medium'>{description}</Utils.Text>
        </Utils.View>
        <Utils.View align='center'>
          <Utils.Text size='xsmall' secondary>{title}</Utils.Text>
          <Utils.Text size='medium'>{description}</Utils.Text>
        </Utils.View> */}
        {rightBtn}
      </Utils.Row>
    </Utils.Content>
  )
}

export default Header