import * as React from "react";
import { render } from "@testing-library/react-native";
// Asegúrate de que el path sea correcto
import { Hit } from "@/types/algoliaResponse";
import { ArticleCard } from "@/components/ArticlesCard";

describe("ArticleCard Component", () => {
  it("renders correctly", () => {
    // expectInput
    const mockProps: Hit = {
      _highlightResult: {
        author: {
          matchLevel: "none",
          matchedWords: [],
          value: "Jeema101",
        },
        comment_text: {
          matchLevel: "full",
          matchedWords: ["mobile"],
          value:
            "It's very strange - some people are lucid and \u003Cem\u003Emobile\u003C/em\u003E up until nearly the end, and others are 'out of it' for a long time.",
        },
        story_title: {
          matchLevel: "none",
          matchedWords: [],
          value: "Jake Seliger has died",
        },
        story_url: {
          matchLevel: "none",
          matchedWords: [],
          value:
            "https://marginalrevolution.com/marginalrevolution/2024/08/jake-seliger-is-dead.html",
        },
      },
      _tags: ["comment", "author_Jeema101", "story_41201555"],
      id: 41205939,
      author: "Jeema101",
      comment_text: "It's very strange...",
      created_at: "2024-08-09T22:37:25Z",
      created_at_i: 1723243045,
      objectID: "41205939",
      parent_id: 41203608,
      story_id: 41201555,
      story_title: "Jake Seliger has died",
      story_url:
        "https://marginalrevolution.com/marginalrevolution/2024/08/jake-seliger-is-dead.html",
      updated_at: "2024-08-09T23:05:36Z",
    };

    const { getByText } = render(
      <ArticleCard
        {...mockProps}
        index={0}
        onSwipeLeft={jest.fn()}
        onSwipeRight={jest.fn()}
      />
    );

    // expectOutput
    expect(getByText("Jake Seliger has died")).toBeTruthy(); // story_title
    expect(
      getByText(
        "Source : https://marginalrevolution.com/marginalrevolution/2024/08/jake-seliger-is-dead.html"
      )
    ).toBeTruthy(); // story_url
  });
});
