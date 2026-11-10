import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import * as React from "react";
import { Footer } from "../footer";
import { I18nProvider } from "@/i18n/I18nProvider";

afterEach(() => {
  cleanup();
});

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider locale="en">{ui}</I18nProvider>);
}

describe("Footer", () => {
  it("renders brand, contact info and sections", () => {
    renderWithI18n(<Footer />);

    expect(screen.getByLabelText(/ProServe homepage/i)).toBeDefined();
    expect(screen.getByText("hello@proserve.ae")).toBeDefined();
    expect(screen.getByText("+971 4 400 0000")).toBeDefined();
  });

  it("toggles mobile accordion sections on click", () => {
    renderWithI18n(<Footer />);

    const servicesToggles = screen.getAllByRole("button", { name: /Services/i });
    const mobileToggle = servicesToggles[0];
    expect(mobileToggle.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(mobileToggle);
    expect(mobileToggle.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(mobileToggle);
    expect(mobileToggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders download app badges and legal links", () => {
    renderWithI18n(<Footer />);

    expect(screen.getByText("App Store")).toBeDefined();
    expect(screen.getByText("Google Play")).toBeDefined();
    expect(screen.getByText("Privacy Policy")).toBeDefined();
    expect(screen.getByText("Terms of Service")).toBeDefined();
  });
});

