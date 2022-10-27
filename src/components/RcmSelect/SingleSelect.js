import React from 'react';
import Select from 'react-select';
import { Controller } from 'react-hook-form';

const SingleSelect
 = ({name, placeholder, options, control, onChangeInteract}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {value, onChange, ref}}) => {
        return (
          <Select
            ref={ref}
            options={options}
            placeholder={placeholder}
            onChange={(val) => {onChange(val.value); if (onChangeInteract) onChangeInteract(val.value)}}
            value={options.find((c) => c.value === value)}
            defaultValue={options.filter((option) => value === option.value)}
          />
        )
      }}
    />  
  )
}

export default SingleSelect;
