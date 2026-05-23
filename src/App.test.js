import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("@react-three/fiber", () => ({
  Canvas: () => <div data-testid="mock-canvas" />,
  useFrame: () => {},
  useLoader: () => ({ image: { width: 1, height: 1 } }),
}));

HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  drawImage: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Uint8ClampedArray([0, 0, 0, 255]),
  })),
}));

test("renders updated hero heading", () => {
  render(<App />);
  const heading = screen.getByRole("heading", {
    name: /the verified network for real-world action/i,
  });
  expect(heading).toBeInTheDocument();
});
