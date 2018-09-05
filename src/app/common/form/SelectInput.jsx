import React from "react";
import { Form, Label, Select } from "semantic-ui-react";

const SelectInput = ({
  input,
  placeholder,
  multiple,
  options,
  meta: { touched, error }
}) => {
  return (
    <Form.Field error={touched && !!error}>
      <Select
        onChange={(e, data) => input.onChange(data.value)}
        value={input.value || null}
        placeholder={placeholder}
        multiple={multiple}
        options={options}
      />
      {touched &&
        error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
    </Form.Field>
  );
};

export default SelectInput;
