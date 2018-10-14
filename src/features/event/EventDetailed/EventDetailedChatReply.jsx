import React from "react";
import { Link } from "react-router-dom";
import { Comment } from "semantic-ui-react";
import distanceInWords from "date-fns/distance_in_words";

import EventDetailedChatForm from "./EventDetailedChatForm";

const EventDetailedChatReply = ({ comment, showReplyForm, handleOpenReplyForm, selectedCommentId, eventId, addEventComment, handleCloseReplyForm }) => {
  return ( 
    <Comment.Group>
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
            <Comment.Action onClick={handleOpenReplyForm(comment.id)}>
              Reply
            </Comment.Action>
            {showReplyForm &&
              selectedCommentId === comment.id && (
                <EventDetailedChatForm
                  eventId={eventId}
                  addEventComment={addEventComment}
                  form={`reply_${comment.id}`}
                  closeForm={handleCloseReplyForm}
                  parentId={comment.id}
                />
              )}
          </Comment.Actions>
        </Comment.Content>
        {
          comment.childNodes && comment.childNodes.map(child => (
            <EventDetailedChatReply 
              comment={child}
              eventId={eventId}
              addEventComment={addEventComment}
              handleCloseReplyForm={handleCloseReplyForm}
              selectedCommentId={selectedCommentId}
              showReplyForm={showReplyForm}
              handleOpenReplyForm={handleOpenReplyForm}
            />
          ))
        }
      </Comment>
    </Comment.Group>
  );
};

export default EventDetailedChatReply;
