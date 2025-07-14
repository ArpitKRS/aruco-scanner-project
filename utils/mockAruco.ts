interface MockMarker {
  id: number;
  message: string;
}

const MOCK_MARKERS: MockMarker[] = [
  { id: 101, message: "Welcome to the ArUco Demo!" },
  { id: 102, message: "Product: Smartphone XYZ - $699" },
  { id: 103, message: "Event: Tech Conference 2024" },
  { id: 104, message: "Location: Building A, Room 301" },
  { id: 105, message: "WiFi: GuestNetwork - Password: demo123" },
  { id: 106, message: "Menu: Today's Special - Grilled Salmon" },
  { id: 107, message: "Info: Scan for more details about this exhibit" },
  { id: 108, message: "Contact: support@company.com" },
  { id: 109, message: "Promotion: 20% off with code ARUCO20" },
  { id: 110, message: "Navigation: Follow signs to Exit B" },
];

export function generateMockMarker(): MockMarker {
  return MOCK_MARKERS[Math.floor(Math.random() * MOCK_MARKERS.length)];
}

export function getMarkerMessage(id: number): string {
  const marker = MOCK_MARKERS.find(m => m.id === id);
  return marker?.message || `Unknown marker: ${id}`;
}