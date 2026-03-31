import { createBrowserRouter } from "react-router-dom";
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";
import BusDetailScreen from "./BusDetailScreen";
import BusStopScreen from "./BusStopScreen";
import AnalyticsScreen from "./AnalyticsScreen";
import SeatBookingScreen from "./SeatBookingScreen";
import AboutScreen from "./AboutScreen";
import RoutePlannerScreen from "./RoutePlannerScreen";
import BusTerminalsScreen from "./BusTerminalsScreen";
import TicketHistoryScreen from "./TicketHistoryScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/home",
    element: <HomeScreen />,
  },
  {
    path: "/bus/:busNumber",
    element: <BusDetailScreen />,
  },
  {
    path: "/bus/:busNumber/book",
    element: <SeatBookingScreen />,
  },
  {
    path: "/stop/:stopId",
    element: <BusStopScreen />,
  },
  {
    path: "/analytics",
    element: <AnalyticsScreen />,
  },
  {
    path: "/about",
    element: <AboutScreen />,
  },
  {
    path: "/route-planner",
    element: <RoutePlannerScreen />,
  },
  {
    path: "/terminals",
    element: <BusTerminalsScreen />,
  },
  {
    path: "/tickets",
    element: <TicketHistoryScreen />,
  },
]);
