/**
 * Types for the Suggestion/Feedback system
 */

export type SuggestionItemType = 'reward' | 'ingredient';

export type SuggestionStatus = 'pending' | 'reviewed' | 'resolved';

export interface Suggestion {
	id: string;
	user_id: string | null;
	item_type: SuggestionItemType;
	item_id: string;
	item_name: string;
	suggestion_type: string;
	content: string;
	user_email?: string | null;
	status: SuggestionStatus;
	created_at: string;
	updated_at: string;
}

export interface CreateSuggestionData {
	item_type: SuggestionItemType;
	item_id: string;
	item_name: string;
	suggestion_type: string;
	content: string;
	user_email?: string;
}
