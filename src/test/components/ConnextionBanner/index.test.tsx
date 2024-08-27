import * as React from "react";
import { render } from "@testing-library/react-native";
import { ConnectionBanner } from "@/components/ConnextionBanner.tsx";


describe("ConnectionBanner", () => {
  it("renders correctly when online", () => {
    const { getByText } = render(<ConnectionBanner online={true} />);
    const bannerText = getByText("Connected");
    expect(bannerText).toBeTruthy();
  });

  it("renders correctly when offline", () => {
    const { getByText } = render(<ConnectionBanner online={false} />);
    const bannerText = getByText("Offline");
    expect(bannerText).toBeTruthy();
  });
});
