import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import faker from 'faker';
import {qLaunches} from './Launches';

const LOGIN = gql`
  mutation login {
    login(email:"${faker.internet.email()}") 
  }
`

const LAUNCHES = gql`
query bookie {
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
        <td><input type='checkbox' id={id} name="booking" value={isBooked} /></td>
      </tr>
    })
}

const BOOK = gql`
  mutation book($ids: [ID]!) {
    bookTrips (launchIds: $ids) {
      success
    }
  }
`;

const submitChanges = (evt, mBook, refetch) => {
  const bookingElems = document.getElementsByName('booking')
  const bookedAry = [];

  if (bookingElems.length) {
    bookingElems.forEach(booked => {
      if (booked.checked)
        bookedAry.push(booked.id)
    });
    mBook({variables: {ids: bookedAry}})
    // refetch();
  }
}

const Submit = (props) => {
  const {refetch} = props;
  return <Mutation mutation={LOGIN} 
    update={(cache, { data }) => sessionStorage.setItem('auth', data.login)}
    >
    {
       mLogin => {
        if (!sessionStorage.auth) mLogin();
        return <Mutation mutation={BOOK} /*refetchQueries = {['ls', 'bookie']}*/>
          {mBook => (
            <input type="submit" value="Submit Changes"
              onClick={evt => submitChanges(evt, mBook, refetch)} />
          )}
        </Mutation>
      }
    }
  </Mutation>
};

export default function Editor(props) {
  const { setEditing } = props;
  return (
    <Query query={LAUNCHES}>
      {({ data, loading, error, refetch }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>ERROR</p>;
        return (
          <Fragment>
            <Submit refetch={refetch}/>
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