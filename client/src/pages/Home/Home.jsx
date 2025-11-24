import React, { useEffect, useState } from 'react'
import styles from './home.module.css'
import Story from './Story'
import Post from './Post';
import { apiFetchFeed } from '../../api/posts';

const Home = () => {
  const [posts, setPosts] = useState([])

  //fetchUserFeed
  useEffect(() => {
    (async () => {
      const { status, data: { data } } = await apiFetchFeed(1, 5)
      if (status == 500) return console.error("Server side error, please be patient")
      if (status == 401) return console.error("Unauthorized")
      if (status == 200) {
        setPosts(data.posts)
        return
      }
      console.warn('An Unexpected error occurred')

    })()

  }, [])


  return (
    <div className={styles.wrapper}>


      <div className={styles.feed}>
        <div className={styles.stories}>

          <Story />

        </div>


        <section className={styles.posts}>
          {posts && posts.map(post => <Post key={post._id} post={post} />)}
        </section>
      </div>



      <div className={styles.sidebar}>

      </div>
    </div>
  )
}

export default Home
