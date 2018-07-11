import React, { Component } from 'react'
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native'
import { Auth } from 'aws-amplify'
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StackActions, NavigationActions } from 'react-navigation'

import * as Utils from '../../components/Utils'
import Input from '../../components/Input'
import ButtonGradient from '../../components/ButtonGradient'
import { Colors } from '../../components/DesignSystem'
import { checkPublicKeyReusability } from '../../utils/userAccountUtils'
import { version } from '../../../package.json'
import Logo from '../../components/Logo'

class LoginScene extends Component {
  state = {
    username: '',
    password: '',
    signError: null
  }

  componentWillReceiveProps (nextProps) {
    const { navigation } = nextProps
    if (navigation.state.params && navigation.state.params.totpError) {
      this.refs.toast.show('Session expired, try again')
    }
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text,
      signError: null
    })
  }

  navigateToHome = () => {
    const { navigation } = this.props
    this.setState({ loadingSign: false, signError: null }, () => {
      const signToApp = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'App' })],
        key: null
      })
      navigation.dispatch(signToApp)
    })
  }

  signIn = async () => {
    const { navigation } = this.props
    const { username, password } = this.state
    Keyboard.dismiss()

    this.setState({ loadingSign: true, signError: null })

    try {
      const user = await Auth.signIn(username, password)
      if (user.challengeName && user.challengeName === 'SOFTWARE_TOKEN_MFA') {
        this.setState({ loadingSign: false, signError: null }, () =>
          navigation.navigate('ConfirmLogin', { user })
        )
      } else {
        try {
          const isAddressReusable = await checkPublicKeyReusability()
          if (!isAddressReusable) {
            this.props.navigation.navigate('RestoreOrCreateSeed')
          } else {
            this.navigateToHome()
          }
        } catch (err) {
          console.warn(err)
          await Auth.signOut()
          this.setState({
            signError: 'Oops. Login failed, try again',
            loadingSign: false
          })
        }
      }
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        navigation.navigate('ConfirmSignup', { username, password })
        this.setState({ loadingSign: false })
      } else {
        this.setState({ signError: error.message, loadingSign: false })
      }
    }
  }

  _submit = target => {
    const { username, password } = this.state

    if (target === 'username' && !password) {
      this.password.focus()
    } else if (target === 'password' && !username) {
      this.email.focus()
    } else if (username && password) {
      this.signIn()
    }
  }

  _changeEmail = () => {

  }

  renderSubmitButton = () => {
    const { loadingSign } = this.state

    if (loadingSign) {
      return (
        <Utils.Content height={80} justify='center' align='center'>
          <ActivityIndicator size='small' color={Colors.primaryText} />
        </Utils.Content>
      )
    }

    return (
      <ButtonGradient
        text='SIGN IN'
        onPress={this.signIn}
        size='medium'
        marginVertical='large'
      />
    )
  }

  render () {
    const { signError, username, password } = this.state
    const ChangedPassword = this.props.navigation.getParam('changedPassword')
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.background }}
        enabled
      >
        <KeyboardAwareScrollView>
          <Utils.StatusBar />
          <Utils.Container
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode='interactive'
          >
            <Utils.Content justify='center' align='center'>
              <Utils.VerticalSpacer size='large' />
              <Logo />
              <Utils.VerticalSpacer size='small' />
            </Utils.Content>
            <Utils.FormGroup>
              <Input
                innerRef={(input) => { this.email = input }}
                label='EMAIL/USERNAME'
                keyboardType='email-address'
                placeholder='johndoe@somedomain.com'
                value={username}
                onChangeText={(text) => this.changeInput(text, 'username')}
                onSubmitEditing={() => this._submit('username')}
                returnKeyType='next'
                autoCapitalize='none'
              />
              <Input
                innerRef={(input) => { this.password = input }}
                label='PASSWORD'
                secureTextEntry
                placeholder='.........'
                value={password}
                letterSpacing={4}
                onChangeText={text => this.changeInput(text, 'password')}
                onSubmitEditing={() => this._submit('password')}
                returnKeyType='send'
                autoCapitalize='none'
              />
              <Utils.VerticalSpacer size='small' />
              {this.renderSubmitButton()}
            </Utils.FormGroup>
            <Utils.Content justify='center' align='center'>
              {ChangedPassword && (
                <Utils.Text size='small' success>
                  Password Changed
                </Utils.Text>
              )}
              <Utils.Error>{signError}</Utils.Error>
              <Utils.Text
                onPress={() => this.props.navigation.navigate('ForgotPassword')}
                size='small'
                font='light'
                secondary
              >
                FORGOT PASSWORD ?
              </Utils.Text>
              <Utils.VerticalSpacer size='large' />
              <Utils.Text size='xsmall' secondary>
                {`v${version}`}
              </Utils.Text>
            </Utils.Content>
            <Toast
              ref='toast'
              position='center'
              fadeInDuration={750}
              fadeOutDuration={1000}
              opacity={0.8}
            />
          </Utils.Container>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default LoginScene
