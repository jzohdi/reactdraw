import "@testing-library/jest-dom";

// Mock ResizeObserver if not available in test environment
if (typeof ResizeObserver === "undefined") {
    global.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}

// Mock IntersectionObserver if not available in test environment
if (typeof IntersectionObserver === "undefined") {
    global.IntersectionObserver = class IntersectionObserver {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}
