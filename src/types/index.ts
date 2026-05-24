import type { City, Topic, Comment, CommentReaction, Rating, User, PropertyType, ReactionType, CityTier, ConstructionStatus, FlairTag } from '@prisma/client'

export type { City, Topic, Comment, CommentReaction, Rating, User, PropertyType, ReactionType, CityTier, ConstructionStatus, FlairTag }

export type TopicWithRelations = Topic & {
  city: City
  user: Pick<User, 'id' | 'name' | 'username' | 'image'>
  _count?: { comments: number; ratings: number }
  developerSlug?: string | null
  developerName?: string | null
  constructionStatus?: ConstructionStatus | null
}

export type CommentWithRelations = Comment & {
  user: Pick<User, 'id' | 'name' | 'username' | 'image' | 'flairTag'>
  reactions: CommentReaction[]
  replies?: CommentWithRelations[]
  _count?: { replies: number }
}

export type RatingWithUser = Rating & {
  user: Pick<User, 'id' | 'name' | 'username' | 'image'>
}
