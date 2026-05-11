import type { City, Topic, Comment, CommentReaction, Rating, User, PropertyType, ReactionType, CityTier } from '@prisma/client'

export type { City, Topic, Comment, CommentReaction, Rating, User, PropertyType, ReactionType, CityTier }

export type TopicWithRelations = Topic & {
  city: City
  user: Pick<User, 'id' | 'name' | 'image'>
  _count?: { comments: number; ratings: number }
}

export type CommentWithRelations = Comment & {
  user: Pick<User, 'id' | 'name' | 'image'>
  reactions: CommentReaction[]
  replies?: CommentWithRelations[]
  _count?: { replies: number }
}

export type RatingWithUser = Rating & {
  user: Pick<User, 'id' | 'name' | 'image'>
}
