import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const LAUNCHES = gql`query bookie {
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
  const launches = data.launches && data.launches.launches
  return launches &&
    launches.filter(launch => !launch.isBooked).map(launch => {
      const { id, site, mission: { name: missionName }, rocket: { name: rocketName }, isBooked } = launch;
      return <tr key={id}>
        <td>{site}</td>
        <td>{missionName}</td>
        <td>{rocketName}</td>
        <td><input type='checkbox' name="booking" value={isBooked} /></td>
      </tr>
    })
}

const BOOK = gql`
  mutation book {
    bookTrips (launchIds: $ids) {
      success
    }
  }
`;

const submitChanges = (evt, mBook) => {
  const bookingElems = evt.target.parentElement.booking;
  const bookedAry = [];

  if (bookingElems.length) {
    bookingElems.forEach(booked => {
      if (booked.checked)
        bookedAry.push(booked.id)
    });
    mBook({variables: {ids: bookedAry}})
  }
}

const Submit = (props) => {
  return <Mutation mutation={BOOK}>
    {mBook => (
      <input type="submit" value="Submit Changes"
        onClick={evt => submitChanges(evt, mBook)} />
    )}
  </Mutation>;
};

export default function Editor(props) {
  const { setEditing } = props;
  return (
    <Query query={LAUNCHES}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>ERROR</p>;
        return (
          <Fragment>
            <Submit />
            <input type='button' value='go back' onClick={() => setEditing(false)} style={{ marginTop: '20vh' }} />
            <table style={{ border: 'solid 1px' }}>
              <tbody>
                <tr>
                  <th>Site</th><th>Mission</th><th>Rocket</th><th>Book It!</th>
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