const BASE_URL = 'https://bible.helloao.org';

export const CommentaryService = {
    getAvailableCommentaries: async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/available_commentaries.json`);
            if (!response.ok) throw new Error('Failed to fetch commentaries');
            const data = await response.json();
            return data.commentaries || [];
        } catch (error) {
            console.error('Error fetching available commentaries:', error);
            return [];
        }
    },

    getCommentaryBooks: async (commentaryId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/c/${commentaryId}/books.json`);
            if (!response.ok) throw new Error('Failed to fetch commentary books');
            const data = await response.json();
            return data.books || [];
        } catch (error) {
            console.error('Error fetching commentary books:', error);
            return [];
        }
    },

    getChapterCommentary: async (commentaryId, bookId, chapterNumber) => {
        try {
            const response = await fetch(`${BASE_URL}/api/c/${commentaryId}/${bookId}/${chapterNumber}.json`);
            if (!response.ok) throw new Error('Failed to fetch chapter commentary');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching chapter commentary:', error);
            return null;
        }
    }
};
