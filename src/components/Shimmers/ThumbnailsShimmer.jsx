import { useMemo } from 'react'

const ThumbnailsShimmer = ({ total = 3 }) => {
  const thumbnails = useMemo(() => Array(total).fill(1), [])

  return (
    <>
      {thumbnails.map((e, i) => (
        <div key={`${e}_${i}`} className="w-full h-20 rounded-lg animate-pulse">
          <div className="h-20 bg-gray-300 rounded-lg dark:bg-gray-700" />
        </div>
      ))}
    </>
  )
}

export default ThumbnailsShimmer