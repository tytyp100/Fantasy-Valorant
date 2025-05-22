'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  console.log('login function started')
  const supabase = await createClient()

  // get login fields
  const identifier = formData.get('email') as string
  const password = formData.get('password') as string
  console.log('login attempt with identifier:', identifier)

  // use regular login if it is an email
  if (identifier.includes('@')) {
    console.log('email login flow detected')
    const { error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    })

    if (error) {
      console.log('email login error:', error.message)
      redirect('/error')
    }
    console.log('email login successful')
  } else {
    console.log('username login flow detected')
    // for username login, we need to add the email to the profiles table

    // attempt to find the profile by username
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', identifier)
      .single()

    if (profileError || !profileData || !profileData.email) {
      console.log(
        'Profile lookup error or no email found:',
        profileError?.message || 'No email found'
      )
      redirect('/error')
    }

    console.log(
      'found email for username:',
      profileData.email.substring(0, 3) + '***'
    )

    // proceed with regular login
    const { error } = await supabase.auth.signInWithPassword({
      email: profileData.email,
      password,
    })

    if (error) {
      console.log('password login error:', error.message)
      redirect('/error')
    }
    console.log('username login successful')
  }

  console.log('login complete, redirecting to dashboard')
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  console.log('register attempt with username:', username, 'and email:', email)

  // check if username already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    console.log('Username already exists:', username)
    // handle error here TODO
    redirect('/error')
  }

  // sign up with email and password
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, // store username in user data
        display_name: username,
      },
    },
  })

  if (signUpError) {
    console.log('signup error:', signUpError.message)
    redirect('/error')
  }

  await new Promise((resolve) => setTimeout(resolve, 750))

  console.log('Signup complete, redirecting to dashboard')
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
