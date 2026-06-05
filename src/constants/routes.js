/**
 * Single source of truth for client-side route paths.
 * Use these constants in navigate(), Link, and route definitions.
 */
export const ROUTES = {
  home: "/",
  login: "/login",
  adminLogin: "/adminlogin",
  resetPassword: "/reset-password",
  seatBooking: "/seatbooking",
  seatFullInfo: "/SeatFullInfoPage",

  studentDashboard: (userId) => `/dashboard/${userId}`,
  studentPayments: (userId) => `/payments/${userId}`,
  myRequests: (userId) => `/my-requests/${userId}`,
  libraryPolicy: "/sdl/librarypolicy",
  shiftSeatRequest: "/shift-seat-request",

  adminDashboard: "/admindashboard",
  requestsApproval: "/requests-approval",
  overduePayments: "/payments/overduepayments",
  paymentDashboard: "/PaymentDashboard",
  paymentQr: (id, amount) => `/PaymentQR/${id}/${amount}`,

  chartDashboard: "/chartdashboard",
  chatBox: "/ChatBox",
  mailManager: "/MailManager",
  videoGeneration: "/VideoGenerationBox",
  multiselect: "/multiselect",
  game: "/game",
  counter: "/counter",
};
