import React from 'react';
import JoditEditor from "jodit-react";
import { Controller } from 'react-hook-form';

const ControlledEditor
 = ({name, placeholder, control, ...rest}) => {
  return (
    <div {...rest}>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange, onBlur, value, name, ref}}) => {
          return (
            <JoditEditor
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
              placeholder={placeholder}
              onChange={(newValue) => {onChange(newValue)}}
              config={{readonly: false}}
            />
          )
        }}
      />
    </div>  
  )
}

export default ControlledEditor;
