import { APP, SERVER_URL } from '@app/utils/constants'
import axios from 'axios'
import { useEffect, useState } from 'react'

const useVideoViews = (playbackId) => {
    const [loading, setLoading] = useState(false)
    const [views, setViews] = useState(0)

    const fetchVideoViews = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${APP.API_URL}/api/video`, {
                playbackId: playbackId
            })
            if (data && data.success) {
                setViews(data.views)
            }
        } catch (error) {
            console.log('Video Views', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVideoViews()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playbackId])

    return { views, loading }
}

export default useVideoViews