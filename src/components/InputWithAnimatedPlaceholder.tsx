import React from 'react'

const InputWithAnimatedPlaceholder = ({ onChange, length, label }: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    length: number,
    label: string
}) => {
    return (
        <div>
            <div className='relative'>
                <input
                    id='flatNo'
                    className="peer w-full border text-lg border-gray-300 rounded-lg px-2 pt-4 pb-[6px] focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none"
                    onChange={onChange}
                />
                {/* Placeholder */}
                <label
                    htmlFor='flatNo'
                    className={` absolute left-2 top-4 text-gray-500 transition-all  font-roboto
                                    peer-focus-within:top-[2px] peer-focus-within:text-gray-700 peer-focus-within:text-xs peer-focus-within:text-bold 
                                    ${length > 0 ? 'top-[2px] text-gray-700 text-xs text-bold' : ''}`}
                >
                    {label}
                </label>
            </div>
        </div>
    )
}

export default InputWithAnimatedPlaceholder