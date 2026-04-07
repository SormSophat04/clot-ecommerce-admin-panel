import React from 'react';
import { Star } from 'lucide-react';
import './ReviewCard.css';

interface ReviewCardProps {
  name: string;
  timeText: string;
  reviewText: string;
  rating: number;
  avatarUrl: string;
  productImageUrl: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, timeText, reviewText, rating, avatarUrl, productImageUrl }) => {
  return (
    <div className="review-card">
      <div className="review-product-img">
        <img src={productImageUrl} alt="Product" />
      </div>

      <div className="review-header">
        <img src={avatarUrl} alt={name} className="reviewer-avatar" />
        <div className="reviewer-info">
          <h4>{name}</h4>
          <p>{timeText}</p>
        </div>
      </div>

      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < rating ? '#E94560' : 'none'}
            stroke={i < rating ? '#E94560' : '#D1D5DB'}
            strokeWidth={1.5}
          />
        ))}
        <span className="rating-number">{rating}.0</span>
      </div>

      <p className="review-text">"{reviewText}"</p>

      <div className="review-footer">
        <span className="verified-badge">✓ Verified Purchase</span>
      </div>
    </div>
  );
};

export default ReviewCard;
