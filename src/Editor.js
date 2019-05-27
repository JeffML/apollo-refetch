import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const qLaunches = gql`query ls {
  launches {
    launches {
      id
      site
      mission {
        name
      }
      rocket {
        name
        type
      }
      isBooked
    }
  }
}`;

const launchRows = (data) => {
  return data.launches &&
    data.launches.launches &&
    data.launches.launches.map((launch) => {
      const { id, site, mission: { name: missionName }, rocket: { name: rocketName }, isBooked } = launch;
      return <tr key={id}>
        <td>{site}</td>
        <td>{missionName}</td>
        <td>{rocketName}</td>
        <td><input type='checkbox' name="booking" value={isBooked}/></td>
        <td><input type='checkbox' name="scratch" value={false}/></td>
      </tr>
    })
}


export default function Editor(props) {
  const {setEditing} = props;
  return (
    <Query query={qLaunches}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>ERROR</p>;
        return (
          <Fragment>
            <input type='button' value='submit changes' />
            <input type='button' value='go back' onClick={() => setEditing(false)} style={{marginTop: '20vh'}}/>
            <table style={{ border: 'solid 1px' }}>
              <tbody>
                <tr>
                  <th>Site</th><th>Mission</th><th>Rocket</th><th>Book It!</th><th>Scratched <span role="img">😭</span></th>
                </tr>
                {launchRows(data)}
              </tbody>
            </table>
          </Fragment>
        );
      }}
    </Query>
  );
};