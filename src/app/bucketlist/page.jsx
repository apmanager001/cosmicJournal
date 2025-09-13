import BucketList from './comp/bucketList'
import SearchBucketlist from './comp/searchBucketlist'
import React from 'react'

const Page = () => {
  return (
    <div className='px-4 md:px-40 lg:px-60 py-4 space-y-8'>
        <SearchBucketlist />
        <BucketList />
    </div>
  )
}

export default Page