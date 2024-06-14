export interface Review {
    id: number;
    bookId: number;
    name: string;
    rating: number;
    comment: string;
}

export interface NewReview {
    bookId: number;
    name: string;
    rating: number;
    comment: string;
}

const API_URL = 'http://localhost:8080/api';

export const getAllReviews = async (): Promise<Review[]> => {
    const response = await fetch(`${API_URL}/get/reviews`);
    const data = await response.text();
    return JSON.parse(data);
};

export const getReviewsByBookId = async (bookId: number): Promise<Review[]> => {
    const response = await fetch(`${API_URL}/get/reviews/book/${bookId}`);
    const data = await response.text();
    return JSON.parse(data);
};

export const addReview = async (review: NewReview, bookId: number): Promise<Review> => {
    const response = await fetch(`${API_URL}/add/review/${bookId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    });
    const data = await response.text();
    console.log("addReview response:", data);
    return JSON.parse(data);
};

export const deleteReview = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/delete/review/${id}`, {
        method: 'DELETE',
    });
};

export const getAverageRatingByBookId = async (bookId: number): Promise<number> => {
    const reviews = await getReviewsByBookId(bookId);
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    return reviews.length ? totalRatings / reviews.length : 0;
};
