'use client'

import { useEffect } from 'react'
import commentBox from 'commentbox.io'

const PROJECT_ID = process.env.NEXT_PUBLIC_COMMENTBOX_PROJECT_ID

/**
 * CommentBox.io thread for a single app page.
 *
 * `threadUrl` is the canonical URL that identifies the comment thread. We pass
 * it explicitly (rather than relying on CommentBox's default location-based id)
 * so preview deploys and the production site share one thread per app instead
 * of fragmenting by host.
 */
export function Comments({ threadUrl }: { threadUrl: string }) {
  useEffect(() => {
    if (!PROJECT_ID) return
    const removeCommentBox = commentBox(PROJECT_ID, {
      defaultBoxId: 'commentbox',
      createBoxUrl: () => threadUrl,
    })
    return () => removeCommentBox()
  }, [threadUrl])

  if (!PROJECT_ID) return null
  return <div className="commentbox" />
}
