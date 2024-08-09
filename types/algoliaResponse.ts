export type HighlightResult = {
  matchLevel: string;
  matchedWords: string[];
  value: string;
};

type HighlightResultContainer = {
  author: HighlightResult;
  comment_text: HighlightResult;
  story_title: HighlightResult;
  story_url: HighlightResult;
};

export type Hit = {
  _highlightResult: HighlightResultContainer;
  _tags: string[];
  author: string;
  comment_text: string;
  created_at: string;
  created_at_i: number;
  objectID: string;
  parent_id: number;
  story_id: number;
  story_title: string;
  story_url: string;
  updated_at: string;
};

export type AlgoliaResponse = {
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  hits: Hit[];
};
