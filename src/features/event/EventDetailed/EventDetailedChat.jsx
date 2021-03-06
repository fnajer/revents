import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Segment, Comment, Header } from "semantic-ui-react";
import distanceInWords from "date-fns/distance_in_words";

import EventDetailedChatForm from "./EventDetailedChatForm";
import EventDetailedChatReply from "./EventDetailedChatReply";

export class EventDetailedChat extends Component {
  state = {
    showReplyForm: false,
    selectedCommentId: null,
  }

  handleOpenReplyForm = (id) => () => {
    this.setState({
      showReplyForm: true,
      selectedCommentId: id,
    });
  }

  handleCloseReplyForm = () => {
    this.setState({
      showReplyForm: false,
      selectedCommentId: null,
    });
  }

  render() {
    const { eventId, addEventComment, eventChat } = this.props;
    const { showReplyForm, selectedCommentId } = this.state;
    return (
      <div>
        <Segment
          textAlign="center"
          attached="top"
          inverted
          color="teal"
          style={{ border: "none" }}
        >
          <Header>Chat about this event</Header>
        </Segment>

        <Segment attached>
          <Comment.Group>
            {eventChat &&
              eventChat.map(comment => (
                <Comment key={comment.id}>
                  <Comment.Avatar src={comment.photoURL} />
                  <Comment.Content>
                    <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                      {comment.displayName}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>{distanceInWords(comment.date, Date.now())}</div>
                    </Comment.Metadata>
                    <Comment.Text>{comment.text}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action onClick={this.handleOpenReplyForm(comment.id)}>Reply</Comment.Action>
                      {
                        showReplyForm && selectedCommentId === comment.id &&
                        <EventDetailedChatForm 
                          eventId={eventId}
                          addEventComment={addEventComment}
                          form={`reply_${comment.id}`}
                          closeForm={this.handleCloseReplyForm}
                          parentId={comment.id}
                        />
                      }
                    </Comment.Actions>
                  </Comment.Content>
                  {
                    comment.childNodes && comment.childNodes.map(child => (
                      <EventDetailedChatReply 
                        comment={child}
                        eventId={eventId}
                        addEventComment={addEventComment}
                        handleCloseReplyForm={this.handleCloseReplyForm}
                        selectedCommentId={selectedCommentId}
                        showReplyForm={showReplyForm}
                        handleOpenReplyForm={this.handleOpenReplyForm}
                      />
                    ))
                  }
                </Comment>
              ))}
          </Comment.Group>

          <EventDetailedChatForm
            eventId={eventId}
            addEventComment={addEventComment}
            form={'newComment'}
            parentId={0}
          />
        </Segment>
      </div>
    );
  }
}

export default EventDetailedChat;
