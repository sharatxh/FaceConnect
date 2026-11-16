
import {
  CheckIcon,
  CopyIcon,
  MessageSquareIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  UsersIcon,
  VideoIcon,
  VideoOffIcon,
} from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ControlBar = ({
  roomId,
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onToggleChat,
  onToggleParticipants,
  isChatOpen,
  isParticipantsOpen,
  unreadCount,
  participantCount,
  isHost,
  onLeave,
  onEndMeeting,
}) => {
  const [copied, setCopied] = useState(false)

  const copyMeetingId = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Meeting link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Unable to copy meeting link')
    }
  }

  return (
    <footer className="relative z-40 flex w-full items-center justify-between gap-3 border-t border-slate-800 bg-[#111827] px-3 py-3 sm:px-6">

      {/* Left: Meeting Information */}
      <div className="hidden min-w-0 items-center gap-3 sm:flex">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Meeting ID
          </span>
          <span className="font-mono text-xs font-semibold text-slate-300">
            {roomId}
          </span>
        </div>

        <button
          onClick={copyMeetingId}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500/50 hover:bg-slate-700 hover:text-white"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-emerald-400" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
          {copied ? 'Copied' : 'Copy Link'}
        </button>
      </div>

      {/* Center: Meeting Controls */}
      <div className="mx-auto flex items-center justify-center gap-2 sm:gap-3">

        {/* Microphone */}
        <button
          onClick={onToggleAudio}
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all sm:h-12 sm:w-12 ${
            audioEnabled
              ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
              : 'border-rose-500/30 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25'
          }`}
          title={audioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {audioEnabled ? (
            <MicIcon className="h-5 w-5" />
          ) : (
            <MicOffIcon className="h-5 w-5" />
          )}
        </button>

        {/* Camera */}
        <button
          onClick={onToggleVideo}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all sm:h-12 sm:w-12 ${
            videoEnabled
              ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
              : 'border-rose-500/30 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25'
          }`}
          title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {videoEnabled ? (
            <VideoIcon className="h-5 w-5" />
          ) : (
            <VideoOffIcon className="h-5 w-5" />
          )}
        </button>

        {/* Chat */}
        <button
          onClick={onToggleChat}
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all sm:h-12 sm:w-12 ${
            isChatOpen
              ? 'border-blue-500 bg-blue-600 text-white'
              : 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
          }`}
          title="Toggle Chat"
        >
          <MessageSquareIcon className="h-5 w-5" />

          {unreadCount > 0 && !isChatOpen && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#111827] bg-blue-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Participants */}
        <button
          onClick={onToggleParticipants}
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all sm:h-12 sm:w-12 ${
            isParticipantsOpen
              ? 'border-blue-500 bg-blue-600 text-white'
              : 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
          }`}
          title="Toggle Participants"
        >
          <UsersIcon className="h-5 w-5" />

          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#111827] bg-slate-600 px-1 text-[10px] font-bold text-white">
            {participantCount}
          </span>
        </button>

        {/* Leave / End Meeting */}
        {isHost ? (
          <button
            onClick={onEndMeeting}
            className="ml-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-3 text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-700 sm:h-12 sm:px-5"
            title="End Meeting for All"
          >
            <PhoneOffIcon className="h-5 w-5" />
            <span className="hidden text-sm font-semibold md:inline">
              End Meeting
            </span>
          </button>
        ) : (
          <button
            onClick={onLeave}
            className="ml-1 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-700 sm:h-12 sm:w-12"
            title="Leave Meeting"
          >
            <PhoneOffIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Right: FaceConnect Branding */}
      <div className="hidden min-w-[120px] items-center justify-end gap-2 sm:flex">
        <img
          src="/logo.svg"
          alt="FaceConnect"
          className="h-7 w-7 rounded-lg"
        />
        <span className="text-sm font-bold tracking-tight text-slate-300">
          Face<span className="text-blue-400">Connect</span>
        </span>
      </div>

    </footer>
  )
}

export default ControlBar
