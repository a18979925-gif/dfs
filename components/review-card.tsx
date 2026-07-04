'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  date: string;
  verified: boolean;
}

interface ReviewCardProps {
  review: Review;
  onHelpful?: (id: string) => void;
}

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  return (
    <Card className="card-elevated">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-sm font-semibold">
              {review.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-sm">{review.author}</p>
              <p className="text-xs text-muted-foreground">{review.date}</p>
            </div>
          </div>
          {review.verified && (
            <Badge variant="outline" className="text-xs">
              Zweryfikowany
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
              }`}
            />
          ))}
          <span className="text-sm font-semibold ml-2">{review.rating}/5</span>
        </div>

        <h4 className="font-semibold text-sm mb-2">{review.title}</h4>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{review.content}</p>

        <Separator className="my-3" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => onHelpful?.(review.id)}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {review.helpful}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
