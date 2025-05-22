'use client'

import React, { useState } from 'react'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    if (isLogin) {
      await login(formData)
    } else {
      await signup(formData)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-slate-950 relative flex items-center justify-center p-4'>
      <div className='w-full max-w-md z-10'>
        <div className='text-center mb-6'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <h1 className='text-2xl font-bold text-white'>Valorant Fantasy</h1>
          </div>
          <p className='text-slate-400'>Sign in to manage your fantasy team</p>
        </div>

        <Card className='border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-xl'>
          <CardHeader className='border-b border-slate-800 pb-7'>
            <div className='flex space-x-2 text-sm w-full'>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 pb-4 font-semibold ${
                  isLogin
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 pb-4 font-semibold ${
                  !isLogin
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Register
              </button>
            </div>
          </CardHeader>
          <CardContent className='pt-8'>
            <form action={handleSubmit} className='space-y-6'>
              <div className='space-y-4'>
                {!isLogin && (
                  <div className='space-y-2'>
                    <label
                      htmlFor='username'
                      className='text-sm font-medium text-slate-300'
                    >
                      Username
                    </label>
                    <input
                      id='username'
                      name='username'
                      type='text'
                      required
                      className='w-full bg-slate-800 border border-slate-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                      placeholder='Choose a display name'
                    />
                  </div>
                )}
                <div className='space-y-2'>
                  <label
                    htmlFor='email'
                    className='text-sm font-medium text-slate-300'
                  >
                    {isLogin ? 'Email or Username' : 'Email'}
                  </label>
                  <input
                    id='email'
                    name='email'
                    type={isLogin ? 'text' : 'email'}
                    required
                    className='w-full bg-slate-800 border border-slate-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    placeholder={
                      isLogin
                        ? 'Enter your email or username'
                        : 'Enter your email'
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <label
                    htmlFor='password'
                    className='text-sm font-medium text-slate-300'
                  >
                    Password
                  </label>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    className='w-full bg-slate-800 border border-slate-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    placeholder={
                      isLogin ? 'Enter your password' : 'Create a password'
                    }
                  />
                </div>
              </div>

              {isLogin && (
                <div className='text-right'>
                  <a
                    href='#'
                    className='text-sm text-red-400 hover:text-red-300'
                  >
                    Forgot your password?
                  </a>
                </div>
              )}

              <Button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-md font-medium'
              >
                {loading
                  ? 'Processing...'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className='border-t border-slate-800 pt-6 flex justify-center'>
            <div className='text-sm text-slate-400'>
              <Link href='/' className='text-red-400 hover:text-red-300'>
                Return to home page
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
