import { Field } from 'formik'
import React from 'react'

const FormikModifiedField = ({ fieldName, fieldLabel }: { fieldName: string, fieldLabel: string }) => {
    return (
        <div>
            <Field name={fieldName}>
                {({
                    field, // { name, value, onChange, onBlur }
                    form: { touched, errors, value }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta
                }) => (
                    <div className='relative'>
                        {/* <p>{field.value}</p> */}
                        <input
                            id={fieldName}
                            className={`peer w-[300px] text-lg   px-2 pt-4 pb-[6px] focus:ring outline-none focus:mb-[3px]
                                ${meta.touched && meta.error ?
                                    'border-red-400 border-2  focus:ring-red-300 mt-[-2px]' :
                                    'border-gray-300 border  focus:border-blue-500 focus:ring-blue-300'}
                                `}
                            {...field}
                        />
                        {/* Placeholder */}
                        <label
                            htmlFor='street'
                            className={` absolute left-2 top-4 text-gray-500 transition-all  font-roboto
                                peer-focus-within:top-[2px] peer-focus-within:text-gray-700 peer-focus-within:text-xs peer-focus-within:text-bold 
                                ${field.value?.length > 0 ? 'top-[2px] text-gray-700 text-xs text-bold' : ''}`}
                        >
                            {fieldLabel}
                        </label>

                    </div>
                )}
            </Field>
        </div>
    )
}

export default FormikModifiedField