import React from 'react'
import { Button, Table } from 'evergreen-ui'
import beaconIds from '../beaconIDs'

export default ({ environment, onApply }) => (
  <Table>
    <Table.Head>
      <Table.TextHeaderCell>
        Name
      </Table.TextHeaderCell>
      <Table.TextHeaderCell>
        Company
      </Table.TextHeaderCell>
      <Table.TextHeaderCell>
        Beacon ID
      </Table.TextHeaderCell>
      <Table.HeaderCell/>
    </Table.Head>
    <Table.Body>
      {beaconIds[environment].map(row => (
        <Table.Row key={row.beaconId}>
          <Table.TextCell>{row.name}</Table.TextCell>
          <Table.TextCell>{row.company}</Table.TextCell>
          <Table.TextCell>{row.beaconId}</Table.TextCell>
          <Table.Cell>
            <Button onClick={() => onApply(row.beaconId)}>Apply</Button>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)
