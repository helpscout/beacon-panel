import React, { Component } from 'react'
import Head from 'next/head'
import ls from 'local-storage'
import { Pane, Table, Button, IconButton, Paragraph, UnorderedList, Heading, Text, TextInput, SegmentedControl, ListItem } from 'evergreen-ui'
import BeaconIDsTable from '../components/BeaconIDsTable'

class Index extends Component {
  state = {
    version: '2.0',
    environment: 'prod',
    beaconIdProd: '7cf94949-4bdd-4e86-92ee-cbe97aedbfd6',
    beaconIdDev: '92298a8c-d6ae-478d-af5f-9588e2a4276b',
  }

  componentDidMount() {
    const state = ls.get('state')
    if (state) {
      this.setState(state, this.loadEmbed)
    }

    this.loadEmbed()
  }

  getBeaconId = () => {
    const { environment } = this.state
    return environment === 'prod' ?
      this.state.beaconIdProd :
      this.state.beaconIdDev
  }

  setBeaconId = (value, callback) => {
    const { environment } = this.state
    if (environment === 'prod') {
      this.setState({
        beaconIdProd: value,
      }, callback)
    } else {
      this.setState({
        beaconIdDev: value,
      }, callback)
    }
  }

  loadEmbed = () => {
    const {
      version,
      environment,
      beaconIdProd,
      beaconIdDev,
    } = this.state

    const beaconId = this.getBeaconId()

    const baseScriptUrl = environment === 'prod' ?
      'https://beacon-v2.helpscout.net' :
      'https://beacon-v2-dev.helpscout.net'

    const scriptPath = version === '2.1' ?
      '/static/js/2.1.js' :
      '/'

    const scriptUrl = `${baseScriptUrl}${scriptPath}`

    ls.set('state', {
      version,
      environment,
      beaconIdProd,
      beaconIdDev,
    })

    if (window.Beacon) {
      window.Beacon('destroy')
      document.querySelectorAll('script').forEach(element => {
        if (element.src.indexOf('https://beacon-v2') === 0) {
          element.parentNode.removeChild(element)
        }
      })
    }

    !function(e,n){
      window.Beacon=n=function(e,n){window.Beacon.readyQueue.push({method:e,options:n})},n.readyQueue=[];var t=e.getElementsByTagName("script")[0],o=e.createElement("script");o.type="text/javascript",o.async=!0,
      o.src=scriptUrl,t.parentNode.insertBefore(o,t)
    }(document,window.Beacon||function(){})

    window.Beacon('init', beaconId)
  }

  render() {
    const { environment } = this.state
    return (
      <Pane display="flex" justifyContent="center" alignItems="center" height="100%">
        <Head>
          <title>Beacon 2 Panel</title>
        </Head>
        <Pane
          width={840}
          background="tint1"
          border="default"
          padding={20}
        >
          <Heading size={900} marginBottom={20}>Beacon 2 🥓</Heading>
          <Pane marginTop={20} marginBottom={20}>
            <Heading size={600} marginBottom={10}>Embed Version</Heading>
            <SegmentedControl
              width={300}
              options={[
                { label: '2.0', value: '2.0' },
                { label: '2.1', value: '2.1' },
              ]}
              value={this.state.version}
              onChange={value => this.setState({ version: value }, () => this.loadEmbed())}
            />
          </Pane>
          <Pane marginTop={20} marginBottom={20}>
            <Heading size={600} marginBottom={10}>Environment</Heading>
            <SegmentedControl
              width={300}
              options={[
                { label: 'Production', value: 'prod' },
                { label: 'Development', value: 'dev' },
              ]}
              value={this.state.environment}
              onChange={value => this.setState({ environment: value }, () => this.loadEmbed())}
            />
            { this.state.environment === 'dev' ? (
                <UnorderedList marginTop={10}>
                  <ListItem icon="info-sign" iconColor="info">
                    Don't forget to connect to the VPN!
                  </ListItem>
                </UnorderedList>
              ) : (
                <Pane padding={15} />
              )
            }
          </Pane>
          <Pane marginTop={20} marginBottom={20}>
            <Heading size={600} marginBottom={10}>Beacon ID</Heading>
            <TextInput
              height={40}
              width={360}
              marginRight={10}
              value={this.getBeaconId()}
              onChange={event => this.setBeaconId(event.target.value)} />
            <Button
              height={40}
              appearance="primary"
              marginRight={10}
              onClick={this.loadEmbed}
            >
              Apply
            </Button>
          </Pane>

          <Pane marginTop={20} marginBottom={20}>
            <Heading size={600} marginBottom={10}>
              Sample Beacon IDs for {(environment === 'prod') ? 'Production' : 'Development'}
            </Heading>
            <BeaconIDsTable
              environment={environment}
              onApply={beaconId => this.setBeaconId(beaconId, this.loadEmbed)}
            />
          </Pane>
        </Pane>
      </Pane>
    )
  }
}


export default Index
