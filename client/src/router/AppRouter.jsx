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
                    <Route path='/:username' element={<Profile />} >
                        <Route index element={<Posts />} />
                        <Route path='saved' element={<Saved />} />
                        <Route path='tagged' element={<Tagged />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}