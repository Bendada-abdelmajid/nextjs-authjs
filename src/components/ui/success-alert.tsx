import { CircleCheckBig } from 'lucide-react'
import React from 'react'

type Props = {
    success: string | null
}

const SuccessAlert = ({ success }: Props) => {
    if (!success) return null
    return (
        <div className='bg-green-100 dark:bg-green-800 rounded-lg p-3 items-center mt-4 flex gap-4 '>
            <CircleCheckBig className='text-green-500 ' />
            <div className='text-left'>
                <h4 className='text-xs font-medium'>success</h4>
                <p className='text-xm opacity-80'>{success}</p>
            </div>
        </div>
    )
}

export default SuccessAlert