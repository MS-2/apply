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
  id: number;
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

export type ProcessingTimingsMS = {
  _request: {
    roundTrip: number;
  };
  afterFetch: {
    format: {
      highlighting: number;
      total: number;
    };
  };
  fetch: {
    query: number;
    total: number;
  };
  getIdx: {
    load: {
      dicts: number;
      gens: number;
      total: number;
    };
    total: number;
  };
  total: number;
};

export type AlgoliaResponse = {
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  hits: Hit[];
  hitsPerPage: number;
  nbHits: number;
  nbPages: number;
  page: number;
  params: string;
  processingTimeMS: number;
  processingTimingsMS: ProcessingTimingsMS;
  query: string;
  serverTimeMS: number;
};
