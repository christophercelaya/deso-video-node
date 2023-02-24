import React from 'react'

export const VideoCardInfoShimmer = () => {
  return (
    <div className="flex items-start space-x-2.5 animate-pulse">
      <div className='w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700' />
      <div className="grid flex-1">
        <div className='flex w-full items-start space-x-5 justify-between '>
          <div className="flex flex-col w-full items-start space-y-2 justify-between min-w-0">
            <div className="bg-gray-300 h-2 w-full rounded-xl dark:bg-gray-700" />
            <div className="bg-gray-300 h-2 w-1/3 rounded-xl dark:bg-gray-700" />
            <div className="flex space-x-2">
              <div className="bg-gray-300 h-2 w-12 rounded-xl dark:bg-gray-700" />
              <div className="bg-gray-300 h-2 w-12 rounded-xl dark:bg-gray-700" />
            </div>
          </div>
          <div className="bg-gray-300 h-2 w-8 rounded-xl dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export const CardShimmer = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col space-x-2 animate-pulse">
        <div className="bg-gray-300 aspect-w-16 aspect-h-9 dark:bg-gray-700" />
      </div>
    </div>
  )
}

const VideoCardShimmer = () => {
  return (
    <div className="w-full rounded-xl">
      <div className="flex flex-col space-x-2 animate-pulse">
        <div className="bg-gray-300 md:rounded-xl aspect-w-16 aspect-h-9 dark:bg-gray-700" />
        <div className="flex py-3 space-x-2">
          <div className="w-9 h-9 bg-gray-300 rounded-full dark:bg-gray-700" />
          <div className="flex-1 py-1 px-2 space-y-2">
            <span className="space-y-2">
              <div className="h-2 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-3 w-1/2 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-3 w-1/2 bg-gray-300 rounded dark:bg-gray-700" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCardShimmer