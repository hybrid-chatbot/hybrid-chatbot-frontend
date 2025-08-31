import { Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react'
import { useState } from "react"
import { message } from "../../interfaces/interfaces"
import '@/styles/main.css';

interface MessageActionsProps {
  message: message
}

export function MessageActions({ message }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLike = () => {
    console.log("like")
    console.log(message.id)
    
    setLiked(!liked)
    setDisliked(false)
  }

  const handleDislike = () => {
    console.log("dislike")
    console.log(message.id)

    setDisliked(!disliked)
    setLiked(false)
  }

  return (
    <div className="message-actions">
      <button className="action-button" onClick={handleCopy}>
        {copied ? (
          <Check className="icon-default" size={16} />
        ) : (
          <Copy className="icon-muted" size={16} />
        )}
      </button>
      <button className="action-button" onClick={handleLike}>
        <ThumbsUp className={liked ? "icon-default" : "icon-muted"} size={16} />
      </button>
      <button className="action-button" onClick={handleDislike}>
        <ThumbsDown className={disliked ? "icon-default" : "icon-muted"} size={16} />
      </button>
    </div>
  )
}