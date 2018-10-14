import React from 'react';
import { Segment, Comment, Header } from 'semantic-ui-react';
import EventDetailedChatForm from './EventDetailedChatForm';

const EventDetailedChat = ({ eventId, addEventComment }) => {
  return (
    <div>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>

      <Segment attached>
        <Comment.Group>
          <Comment>
            <Comment.Avatar src="/assets/user.png" />
            <Comment.Content>
              <Comment.Author as="a">Matt</Comment.Author>
              <Comment.Metadata>
                <div>Today at 5:42PM</div>
              </Comment.Metadata>
              <Comment.Text>How artistic!</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        </Comment.Group>
        
        <EventDetailedChatForm eventId={eventId} addEventComment={addEventComment}/>
      </Segment>
    </div>
  )
}

export default EventDetailedChat;

