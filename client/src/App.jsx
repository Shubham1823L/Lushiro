import './App.css'
import './index.css'
import AppRouter from './router/AppRouter'
import { apiEvents, useAxiosInterceptors } from './api/axios'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'



function App() {
  useAxiosInterceptors()
  const location = useLocation()
  const ref = useRef(null)


  useEffect(() => {
    const start = () => ref.current.continuousStart()
    const complete = () => ref.current.complete()
    apiEvents.on('start', start)
    apiEvents.on('end', complete)

    return () => {
      apiEvents.off('start', start)
      apiEvents.off('end', complete)
    }

  }, [location.pathname])



  return (
    <>
      <LoadingBar ref={ref} height={3} className='topLoadingBar' />
      <AppRouter />
    </>
  )

}

export default App
