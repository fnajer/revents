import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import TextArea from "../../../app/common/form/TextArea";

export class EventDetailedChatForm extends Component {
  handleCommentSubmit = values => {
    const { eventId, addEventComment, reset, closeForm, parentId } = this.props;
    addEventComment(eventId, values, parentId);
    reset();
    if (parentId !== 0) {
      closeForm();
    }
  }
  render() {
    return (
      <Form reply onSubmit={this.props.handleSubmit(this.handleCommentSubmit)}>
        <Field
          name='comment'
          component={TextArea}
          rows={2}
        />
        <Button content="Add Reply" labelPosition="left" icon="edit" primary />
      </Form>
    )
  }
}

export default reduxForm({Fields: 'comment'})(EventDetailedChatForm);
