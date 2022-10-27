import React from 'react';
import Select from 'react-select';
import { Controller } from 'react-hook-form';

const SingleSelect
 = ({name, placeholder, options, control, onChangeInteract}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, onBlur, value, name, ref}}) => {
        return (
          <Select
            onBlur={onBlur}
            value={value}
            name={name}
            ref={ref}
            options={options}
            placeholder={placeholder}
            onChange={(newValue) => {onChange(newValue); if (onChangeInteract) onChangeInteract(newValue.value)}}
          />
        )
      }}
    />  
  )
}

export default SingleSelect;
