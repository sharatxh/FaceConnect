
import { ArrowLeftIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptySessions from '../components/sessions/EmptySessions'
import SessionCard from '../components/sessions/SessionCard'
import SessionDetailModal from '../components/sessions/SessionDetailModal'
import { useAuth } from '@clerk/react'
import api from '../config/api.js'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Sessions = () => {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { isLoaded, isSignedIn, getToken } = useAuth()

  useEffect(() => {
    const fetchSessions = async () => {
      if (!isLoaded || !isSignedIn) return

      try {
        const token = await getToken()
        if (!token) return

        const res = await api('/api/meetings/sessions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setSessions(res.data.meetings || [])
      } catch (_error) {
        toast.error('Failed to load meeting sessions')
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [isLoaded, isSignedIn, getToken])

  const openSessionDetails = async (sessionId) => {
    try {
      const token = await getToken()

      const res = await api.get(`/api/meetings/sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSelectedSession(res.data.meeting)
    } catch (_error) {
      toast.error('Could not fetch session details')
    }
  }

  if (loading) {
    return <Loader text="Loading meeting history..." />
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 md:py-12">

      {/* Back Navigation */}
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
      >
        <ArrowLeftIcon size={16} />
        Back to Dashboard
      </Link>

      {/* Page Heading */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Meeting Sessions
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          View your previous meetings, check session details and reconnect to active meetings.
        </p>
      </div>

      {/* Session Count */}
      {sessions.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Your Meeting History
          </h2>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'}
          </span>
        </div>
      )}

      {/* Sessions Grid / Empty State */}
      {sessions.length === 0 ? (
        <EmptySessions />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onOpenDetails={openSessionDetails}
              onRejoin={(meetingId) => navigate(`/meeting/${meetingId}`)}
            />
          ))}
        </div>
      )}

      {/* Session Detail Modal */}
      <SessionDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />

    </main>
  )
}

export default Sessions
