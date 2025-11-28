import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../pages/auth/Login'
import Profile from '../pages/Profile/Profile'
import ProtectedRoutes from './ProtectedRoutes'
import AntiProtectedRoutes from './AntiProtectedRoutes'
import Signup from '../pages/auth/Signup'
import EnterOtp from '../pages/auth/EnterOtp'
import MainLayout from '../layouts/MainLayout'
import Posts from '../pages/Profile/Posts'
import Saved from '../pages/Profile/Saved'
import Tagged from '../pages/Profile/Tagged'
import Troll from '../pages/Troll/Troll'
import NotFoundPage from '../pages/Extras/NotFoundPage'
import Messages from '../pages/Messages/Messages'
import StartNewChat from '../pages/Messages/StartNewChat'
import ChatArea from '../pages/Messages/ChatArea'


export default function AppRouter() {

    return (
        <Routes>

            <Route element={<AntiProtectedRoutes />} >
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/signup/verify' element={<EnterOtp />} />
            </Route>



            <Route element={<ProtectedRoutes />} >
                <Route element={<MainLayout />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/explore' element={<Troll />} />
                    <Route path='/messages' element={<Messages />} >
                        <Route index element={<StartNewChat />} />
                        <Route path=':username' element={<ChatArea/>}/>
                    </Route>
                    <Route path='/:username' element={<Profile />} >
                        <Route index element={<Posts />} />
                        <Route path='saved' element={<Saved />} />
                        <Route path='tagged' element={<Tagged />} />
                    </Route>
                </Route>
            </Route>


            <Route element={<Troll />} path='/pupu' />
            <Route element={<NotFoundPage />} path='*' />
        </Routes>
    )
}