"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import ky from "ky"
import { MessageSquare, Code2, Users, ArrowRight, Sparkles, Heart, MessageCircle } from "lucide-react"

type Post = {
  id: string
  title: string
  content: string
  type: "discussion" | "showcase" | "blog"
  tags: string[]
  pinned: boolean
  createdAt: string
  commentCount: number
  likeCount: number
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ky.get("/api/community/posts")
      .json<{ posts: Post[] }>()
      .then((res) => setPosts(res.posts))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Badge variant="info" className="mb-3">Community</Badge>
          <h1 className="text-2xl font-bold text-[#ffffff] font-mono">Community Hub</h1>
          <p className="text-sm text-[#606060] font-mono mt-1">Discussions, project showcases, and study groups</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/community/forums">
            <Card variant="bordered" className="hover:border-[#2a2a2a] transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-info" />
                  <CardTitle className="text-xs text-[#ffffff]">Forums</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#606060] font-mono">Discuss concepts, ask questions, share knowledge</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/community/showcase">
            <Card variant="bordered" className="hover:border-[#2a2a2a] transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code2 size={16} className="text-warning" />
                  <CardTitle className="text-xs text-[#ffffff]">Project Showcase</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#606060] font-mono">Share your projects and see what others built</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/profile">
            <Card variant="bordered" className="hover:border-[#2a2a2a] transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-accent" />
                  <CardTitle className="text-xs text-[#ffffff]">Profiles</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#606060] font-mono">View XP, achievements, and learning history</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {loading ? <Spinner label="Loading community feed..." /> : (
          <div className="space-y-2">
            {posts.map((post) => (
              <Link key={post.id} href={`/community/forums/${post.id}`}>
                <Card variant="bordered" className="hover:border-[#2a2a2a] transition-colors cursor-pointer">
                  <CardContent>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={post.type === "showcase" ? "warning" : post.type === "blog" ? "info" : "default"} className="text-[10px]">
                            {post.type}
                          </Badge>
                          <p className="text-sm text-[#ffffff] font-mono font-bold truncate">{post.title}</p>
                        </div>
                        <p className="text-xs text-[#606060] font-mono line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {post.tags.map((tag) => (<span key={tag} className="text-[10px] text-info font-mono">#{tag}</span>))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#606060] font-mono shrink-0">
                        <span className="flex items-center gap-1"><Heart size={12} />{post.likeCount}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={12} />{post.commentCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-16 border border-border rounded-xl">
                <MessageSquare size={40} className="mx-auto text-[#606060] mb-3" />
                <p className="text-sm text-[#c0c0c0] font-mono mb-1">No discussions yet</p>
                <p className="text-xs text-[#606060] font-mono">Be the first to start a conversation!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  )
}

