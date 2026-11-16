import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyMeetingDetails, dummyUser } from '../assets/asset'
import VideoGrid from '../components/meeting/VideoGrid'
import { useWebRTC } from '../hooks/useWebRTC'
import ChatPanel from '../components/meeting/ChatPanel'
import { useChat } from '../hooks/useChat'
import ParticipantList from '../components/meeting/ParticipantList'
import ControlBar from '../components/meeting/ControlBar'
import toast from 'react-hot-toast'
import { useAuth, useUser } from '@clerk/react'
import api from '../config/api'
import Loader from '../components/Loader'

const MeetingRoom = () => {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()
  const { getToken } = useAuth()

  const userdata = useMemo(() => {
    if (!user) return null

    return {
      id: user.id,
      name:
        user.fullName ||
        user.firstName ||
        user.primaryEmailAddress?.emailAddress?.split('@')[0] ||
        'User',
      email: user.primaryEmailAddress?.emailAddress || '',
      image: user.imageUrl || '',
    }
  }, [
    user?.id,
    user?.fullName,
    user?.firstName,
    user?.primaryEmailAddress?.emailAddress,
    user?.imageUrl,
  ])

  const [meeting, setMeeting] = useState(null)
  const [loadingMeeting, setLoadingMeeting] = useState(true)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)

  // Verify meeting before initializing WebRTC
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const token = await getToken()

        const res = await api.get(`/api/meetings/${meetingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.data.meeting.status === 'ended') {
          toast.error('This meeting has ended')
          navigate('/dashboard')
          return
        }

        setMeeting(res.data.meeting)
      } catch (error) {
        const errorMsg =
          error.response?.data?.error || 'Meeting not found or has ended'

        toast.error(errorMsg)
        navigate('/dashboard')
      } finally {
        setLoadingMeeting(false)
      }
    }

    fetchMeeting()
  }, [meetingId, navigate])

  const handleMeetingEnded = useCallback(() => {
    navigate('/dashboard')
  }, [navigate])

  // Initialize WebRTC
  const {
    localStream,
    remoteUsers,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
    endMeeting,
  } = useWebRTC(
    meetingId,
    userdata,
    handleMeetingEnded,
    Boolean(meeting)
  )

  // Initialize chat
  const {
    messages,
    sendMessage,
    unreadCount,
    isChatOpen,
    toggleChat,
  } = useChat(meetingId, userdata)

  const hostId = meeting?.host?.id || meeting?.host

  const isHost = Boolean(
    userdata?.id &&
    hostId &&
    hostId.toString() === userdata.id.toString()
  )

  const handleLeave = () => {
    toast('You left the meeting')
    navigate('/dashboard')
  }

  const handleEndMeeting = () => {
    endMeeting()
    toast('Meeting ended for all participants')
    navigate('/dashboard')
  }

  if (loadingMeeting) {
    return <Loader text="Joining meeting room..." />
  }

  const roomTitle =
    meeting?.title || dummyMeetingDetails.title || 'Video Meeting'

  return (
    <div className="relative flex h-screen h-[100dvh] w-full flex-col overflow-hidden bg-[#0B1120] font-sans text-white">

      {/* Top Navigation */}
      <header className="relative z-30 flex min-h-[68px] items-center justify-between gap-3 border-b border-slate-800 bg-[#111827] px-4 py-3 shadow-lg sm:px-6">

        {/* Brand and Meeting Details */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">

          <button
            onClick={() => navigate('/dashboard')}
            className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
            title="Go to dashboard"
          >
            <img
              src="/logo.svg"
              alt="FaceConnect"
              className="h-9 w-9 rounded-xl object-contain"
            />

            <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
              Face<span className="text-blue-400">Connect</span>
            </span>
          </button>

          <div className="hidden h-8 w-px bg-slate-700 sm:block" />

          <div className="min-w-0">
            <h1 className="max-w-[180px] truncate text-sm font-semibold text-white sm:max-w-xs sm:text-base">
              {roomTitle}
            </h1>

            <div className="mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-[11px] font-medium text-slate-400 sm:text-xs">
                Meeting in progress
              </span>
            </div>
          </div>
        </div>

        {/* Meeting ID */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2">
          <span className="hidden text-xs text-slate-400 sm:block">
            Room ID
          </span>

          <span className="font-mono text-xs font-semibold tracking-wide text-blue-300">
            {meetingId || dummyMeetingDetails.meetingId}
          </span>
        </div>
      </header>

      {/* Meeting Workspace */}
      <main className="relative flex min-h-0 flex-1 overflow-hidden bg-[#0B1120]">

        {/* Subtle Background Decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />
        </div>

        {/* Video Grid */}
        <div className="relative flex min-w-0 flex-1 overflow-hidden">
          <VideoGrid
            localStream={localStream}
            localUser={userdata}
            remoteUsers={remoteUsers}
            audioEnabled={audioEnabled}
            videoEnabled={videoEnabled}
          />
        </div>

        {/* Chat Panel */}
        <ChatPanel
          isOpen={isChatOpen}
          onClose={toggleChat}
          messages={messages}
          onSendMessage={sendMessage}
          currentUser={userdata}
        />

        {/* Participants Panel */}
        <ParticipantList
          isOpen={isParticipantsOpen}
          onClose={() => setIsParticipantsOpen(false)}
          localUser={userdata}
          localAudio={audioEnabled}
          localVideo={videoEnabled}
          remoteUsers={remoteUsers}
          meetingHostId={dummyUser.id}
        />

      </main>

      {/* Meeting Controls */}
      <footer className="relative z-30 border-t border-slate-800 bg-[#111827] px-2 py-3 sm:px-4">
        <ControlBar
          roomId={meetingId || dummyMeetingDetails.meetingId}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onToggleChat={toggleChat}
          onToggleParticipants={() =>
            setIsParticipantsOpen((prev) => !prev)
          }
          isChatOpen={isChatOpen}
          isParticipantsOpen={isParticipantsOpen}
          unreadCount={unreadCount}
          participantCount={1 + remoteUsers.length}
          isHost={isHost}
          onLeave={handleLeave}
          onEndMeeting={handleEndMeeting}
        />
      </footer>

    </div>
  )
}

export default MeetingRoom
