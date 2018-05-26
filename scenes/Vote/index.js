import React, { PureComponent } from 'react'
import { FlatList, TouchableOpacity, View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo'
import { Colors, Spacing } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import Header from '../../components/Header'
// import Client from '../../src/services/client'

class VoteScene extends PureComponent {
  state = {
    voteList: [
      {
        id: 1,
        url: 'http://getty.io',
        issuer: '1231231231312312'
      },
      {
        id: 2,
        url: 'http://google.com',
        issuer: '1231231231312312daskdhgasjdhgasjdhgasjdhgassadgasjdhags'
      },
      {
        id: 3,
        url: 'http://getty.io',
        issuer: '1231231231312312'
      },
      {
        id: 4,
        url: 'http://getty.io',
        issuer: '1231231231312312'
      },
      {
        id: 5,
        url: 'http://getty.io',
        issuer: '1231231231312312'
      },
      {
        id: 6,
        url: 'http://google.com',
        issuer: '1231231231312312'
      },
      {
        id: 7,
        url: 'http://google.com',
        issuer: '1231231231312312'
      },
      {
        id: 8,
        url: 'http://google.com',
        issuer: '1231231231312312'
      },
      {
        id: 9,
        url: 'http://google.com',
        issuer: '1231231231312312'
      }
    ],
    currentItem: null,
    search: ''
  };

  // async componentWillMount() {
  // const { candidates } = await Client.getTotalVotes();
  // console.log('>>>>>>>: ', candidates);
  // this.setState({ voteList: candidates });
  // }

  showModal = (currentItem) => {
    this.setState({
      currentItem
    })
  }

  onChange = (value, field) => {
    this.setState({
      [field]: value
    })
  }

  renderRow = ({ item }) => {
    return (
      <Utils.Item padding={16}>
        <Utils.Row justify='space-between' align='center'>
          <Utils.Row justify='space-between' align='center'>
            <View style={styles.rank}>
              <Utils.Text secondary>#{item.id}</Utils.Text>
            </View>
            <Utils.Text lineHeight={20}>{item.url}</Utils.Text>
          </Utils.Row>
          <Utils.Row align='center' justify='space-between'>
            <TouchableOpacity style={styles.button} onPress={() => this.showModal(item)}>
              <Utils.Text size='xsmall'>-</Utils.Text>
            </TouchableOpacity>
            <Utils.FormInput
              underlineColorAndroid='transparent'
              keyboardType='numeric'
              onChangeText={(text) => this.onChange(text, 'search')}
              placeholderTextColor='#fff'
              placeholder='0'
              style={{ marginLeft: 5, marginRight: 5 }}
            />
            <TouchableOpacity style={styles.button} onPress={() => this.showModal(item)}>
              <Utils.Text size='xsmall'>+</Utils.Text>
            </TouchableOpacity>
          </Utils.Row>
        </Utils.Row>
      </Utils.Item>
    )
  }

  render () {
    const { voteList } = this.state
    return (
      <Utils.Container>
        <Utils.StatusBar transparent />
        <Header>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>TOTAL VOTES</Utils.Text>
            <Utils.Text size='small'>945,622,966</Utils.Text>
          </Utils.View>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>TOTAL REMAINING</Utils.Text>
            <Utils.Text size='small'>14,106</Utils.Text>
          </Utils.View>
        </Header>
        <Utils.Row style={styles.searchWrapper} justify='space-between' align='center'>
          <Utils.FormInput
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.onChange(text, 'search')}
            placeholder='Search'
            placeholderTextColor='#fff'
            style={{ width: '70%' }}
          />
          <TouchableOpacity onPress={() => {}}>
            <LinearGradient
              start={[0, 1]}
              end={[1, 0]}
              colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
              style={styles.submitButton}
            >
              <Utils.Text size='xsmall'>Submit</Utils.Text>
            </LinearGradient>
          </TouchableOpacity>
        </Utils.Row>
        <FlatList
          data={voteList}
          removeClippedSubviews
          renderItem={this.renderRow}
          keyExtractor={item => `${item.id}`}
        />
      </Utils.Container>
    )
  }
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingLeft: 24,
    paddingRight: 24
  },
  rank: {
    paddingRight: 10
  },
  submitButton: {
    padding: Spacing.small,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%'
  },
  button: {
    backgroundColor: Colors.secondaryText,
    borderColor: Colors.secondaryText,
    borderRadius: 5,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default VoteScene