import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const LAUNCHES = gql`query launchesToEdit {
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

const SCRATCH = gql`
`;

const BOOK = gql`
`;

const submitChanges = (evt, mScratch, mBook) => {
  const scratchElems = evt.target.parentElement.scratch;
  const bookingElems = evt.target.parentElement.booking;

  const scratchedAry = [];
  const bookedAry = [];

  if (scratchElems.length) {
    scratchElems.forEach(scratched => {
      if (scratched.checked) 
        scratchedAry.push(scratched.id)
      });
  }

  if (bookingElems.length) {
    bookingElems.forEach(booked => {
      if (booked.checked) 
        bookedAry.push(booked.id)
      });
  }
}

const Submit = (props) => {
  return <Mutation mutation={SCRATCH}>
    {mScratch => (
      <Mutation mutation={BOOK}>
        {mBook => (
          <input type="submit" value="Submit Changes"
            onClick={evt => submitChanges(evt, mScratch, mBook)} />
        )}
      </Mutation>
    )}
  </Mutation>;
};

export default function Editor(props) {
  const {setEditing} = props;
  return (
    <Query query={LAUNCHES}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>ERROR</p>;
        return (
          <Fragment>
            <Submit/>
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