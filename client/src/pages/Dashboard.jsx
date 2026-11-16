import React, { useEffect, useState } from 'react'
import {
  ArrowRightIcon,
  KeyboardIcon,
  PlusIcon,
  ShieldCheckIcon,
  VideoIcon,
  ClockIcon,
  UsersIcon,
  SparklesIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth, useUser } from '@clerk/react'
import api from '../config/api.js'

const Dashboard = () => {
  const { user } = useUser()
  const { isLoaded, isSignedIn, getToken } = useAuth()

  const navigate = useNavigate()

  const userName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'User'

  const userEmail =
    user?.primaryEmailAddress?.emailAddress || ''

  const [isCreating, setIsCreating] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState(null)
  const [joinId, setJoinId] = useState('')

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch meeting statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!isLoaded || !isSignedIn) return

      try {
        const token = await getToken()

        const { data } = await api.get('/api/meetings/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setStats(data)
      } catch (error) {
        toast.error(
          error.response?.data?.error || error.message
        )
      }
    }

    fetchStats()
  }, [isLoaded, isSignedIn, getToken])

  // Create a new meeting
  const handleCreateMeeting = async () => {
    if (!isLoaded || !isSignedIn) return

    setIsCreating(true)

    try {
      const token = await getToken()

      const res = await api.post(
        '/api/meetings',
        {
          title: `${userName}'s Meeting`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const meetingId = res.data.meeting.meetingId

      toast.success('Meeting created!')

      navigate(`/meeting/${meetingId}`)
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message
      )
    } finally {
      setIsCreating(false)
    }
  }

  // Join an existing meeting
  const handleJoinMeeting = async (e) => {
    e.preventDefault()

    const cleanId = joinId.trim()

    if (!/^[a-z]{3}(?:-[a-z]{3}){2}$/.test(cleanId)) {
      toast.error('Please enter a valid Meeting ID')
      return
    }

    try {
      const token = await getToken()

      await api.get(`/api/meetings/${cleanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      navigate(`/meeting/${cleanId}`)
    } catch (error) {
      toast.error('Meeting not found. Check the ID and try again.')
    }
  }

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">

        {/* Welcome Section */}
        <div className="mb-10">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <ShieldCheckIcon size={16} />
            Secure video communication
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Video meetings,
            <br className="hidden sm:block" />
            <span className="text-blue-600">
              made simple.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Connect, collaborate and communicate with anyone,
            anywhere. Start a meeting or join an existing one
            in just a few clicks.
          </p>

        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">

          {/* Left Section */}
          <div className="space-y-7 lg:col-span-7">

            {/* Create Meeting Card */}
            <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-7 text-white shadow-xl shadow-blue-100 sm:p-9">

              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-white/10" />

              <div className="relative z-10">

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <VideoIcon size={28} />
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Start a new meeting
                </h2>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-blue-100 sm:text-base">
                  Create your own meeting room and invite
                  others to join you instantly.
                </p>

                <button
                  onClick={handleCreateMeeting}
                  disabled={isCreating}
                  className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PlusIcon size={20} />

                  {isCreating ? 'Creating...' : 'New Meeting'}

                  {!isCreating && (
                    <ArrowRightIcon size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* Join Meeting Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <KeyboardIcon size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Join a meeting
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Have a meeting code? Enter it below.
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleJoinMeeting}
                className="flex flex-col gap-3 sm:flex-row"
              >

                <div className="relative flex-1">

                  <KeyboardIcon
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="abc-def-ghi"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <button
                  type="submit"
                  disabled={!joinId.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Join Meeting
                  <ArrowRightIcon size={18} />
                </button>

              </form>

              <p className="mt-3 text-xs text-slate-400">
                Enter the meeting ID shared by your host.
              </p>

            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <VideoIcon size={20} />
                </div>

                <h3 className="font-semibold text-slate-800">
                  HD Video
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Clear video communication.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UsersIcon size={20} />
                </div>

                <h3 className="font-semibold text-slate-800">
                  Collaboration
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Connect with your team.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheckIcon size={20} />
                </div>

                <h3 className="font-semibold text-slate-800">
                  Secure
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Protected user access.
                </p>
              </div>

            </div>

          </div>

          {/* Right Section */}
          <div className="space-y-6 lg:col-span-5">

            {/* User and Clock Card */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 bg-gradient-to-br from-blue-50 to-white p-7 sm:p-8">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Welcome back,
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      {userName}
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <SparklesIcon size={24} />
                  </div>

                </div>

                <div className="mt-8">

                  <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                    <ClockIcon size={17} />
                    Current local time
                  </div>

                  <h3 className="mt-2 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                    {formattedTime}
                  </h3>

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    {formattedDate}
                  </p>

                </div>

              </div>

              {/* Account Details */}
              <div className="space-y-5 p-7 sm:p-8">

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Account Information
                  </p>

                  <p className="break-all text-sm font-medium text-slate-700">
                    {userEmail}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">

                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <SparklesIcon size={17} className="text-blue-600" />
                    Subscription Plan
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    stats?.plan === 'premium'
                      ? 'bg-blue-600 text-white'
                      : 'border border-blue-100 bg-white text-blue-700'
                  }`}>
                    {stats?.plan || 'Free'}
                  </span>

                </div>

                {stats && (
                  <div className="rounded-xl border border-slate-200 p-4">

                    <div className="mb-3 flex items-center justify-between gap-2">

                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <CalendarDaysIcon size={17} className="text-blue-600" />
                        Monthly Meetings
                      </div>

                      <CheckCircle2Icon
                        size={18}
                        className="text-emerald-500"
                      />

                    </div>

                    <p className="text-2xl font-bold text-slate-900">
                      {stats.monthlyCount ?? 0}
                      {stats.monthlyLimit
                        ? (
                          <span className="text-sm font-medium text-slate-400">
                            {' '}/ {stats.monthlyLimit}
                          </span>
                        )
                        : (
                          <span className="ml-2 text-xs font-medium text-slate-400">
                            Created
                          </span>
                        )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {stats.monthlyLimit
                        ? 'Meetings used this month'
                        : 'Unlimited meeting availability'}
                    </p>

                    {stats.monthlyLimit && (
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              (stats.monthlyCount / stats.monthlyLimit) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* Quick Information */}
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <ShieldCheckIcon size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Stay connected with FaceConnect
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Create a meeting, share your meeting ID and
                    bring everyone together in one place.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Dashboard
