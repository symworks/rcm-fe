import React from 'react';
import Select from 'react-select';
import { Controller } from 'react-hook-form';

const ControlledSelect
 = ({name, placeholder, options, control, onChangeInteract = undefined, isMulti = false, ...rest}) => {
  return (
    <div {...rest}>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange, onBlur, value, name, ref}}) => {
          return (
            <Select
              onBlur={onBlur}
              value={value}
              name={name}
              isMulti={isMulti}
              ref={ref}
              options={options}
              placeholder={placeholder}
              onChange={(newValue) => {onChange(newValue); if (onChangeInteract) onChangeInteract(newValue.value)}}
            />
          )
        }}
      />
    </div>  
  )
}

export default ControlledSelect;
