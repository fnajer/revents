import React from 'react';
import { Link } from "react-router-dom";
import { Segment, Comment, Header } from 'semantic-ui-react';
import distanceInWords from "date-fns/distance_in_words";

import EventDetailedChatForm from './EventDetailedChatForm';

const EventDetailedChat = ({ eventId, addEventComment, eventChat }) => {
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
          {
            eventChat && eventChat.map(comment => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.photoURL} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.uid}`}>{comment.displayName}</Comment.Author>
                  <Comment.Metadata>
                    <div>{distanceInWords(comment.date, Date.now())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.text}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            ))
          }
        </Comment.Group>
        
        <EventDetailedChatForm eventId={eventId} addEventComment={addEventComment}/>
      </Segment>
    </div>
  )
}

export default EventDetailedChat;

