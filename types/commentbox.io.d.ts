declare module 'commentbox.io' {
  interface CommentBoxOptions {
    className?: string
    defaultBoxId?: string
    tlcParam?: string
    sortOrder?: 'best' | 'newest' | 'oldest'
    backgroundColor?: string | null
    textColor?: string | null
    subtextColor?: string | null
    createBoxUrl?: (boxId: string, pageLocation: Location) => string
    onCommentCount?: (count: number) => void
  }

  /** Initializes CommentBox; returns a cleanup function to call on unmount. */
  export default function commentBox(
    projectId: string,
    options?: CommentBoxOptions,
  ): () => void
}
