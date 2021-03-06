import React, { Component } from "react";
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { Grid } from "semantic-ui-react";
import LoadingComponent from '../../../app/layout/LoadingComponent';

import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedSidebar from "./UserDetailedSidebar";
import UserDetailedEvents from "./UserDetailedEvents";

import { userDetailedQueries } from "../userQueries";
import { getUserEvents, followUser } from "../userActions";


const mapState = (state, ownProps) => {
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile;
  } else {
    profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }

  return {
    auth: state.firebase.auth,
    userUid,
    events: state.events,
    eventsLoading: state.async.loading,
    profile,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting,
  }
};

const actions = {
  getUserEvents,
  followUser,
};

class UserDetailedPage extends Component {
  async componentDidMount() {
    await this.props.getUserEvents(this.props.userUid);
  }

  handleFollowUser = async () => {
    await this.props.followUser(this.props.userUid);
  }

  changeTab = (e, data) => {
    this.props.getUserEvents(this.props.userUid, data.activeIndex);
  }

  render() {
    const { profile, photos, auth, match, requesting, events, eventsLoading } = this.props;
    const isCurrentUser = auth.uid === match.params.id;
    const loading = Object.values(requesting).some(a => a === true);
    if (loading) return <LoadingComponent inverted={true}/>
    return (
      <Grid>
        <UserDetailedHeader profile={profile}/>
        <UserDetailedDescription profile={profile}/>
        <UserDetailedSidebar isCurrentUser={isCurrentUser} handleFollowUser={this.handleFollowUser} />
        <UserDetailedPhotos photos={photos} />
        <UserDetailedEvents events={events} eventsLoading={eventsLoading} changeTab={this.changeTab}/>
      </Grid>
    );
  }
}

export default compose(
  connect(mapState, actions),
  firestoreConnect((auth, userUid) => userDetailedQueries(auth, userUid)),
)(UserDetailedPage);
