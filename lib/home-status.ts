// Home status badge utilities

export interface StatusBadge {
  label: string;
  className: string;
}

export function getHomeStatusBadge(status: string): StatusBadge {
  switch (status) {
    case "AVAILABLE":
      return {
        label: "Available Now",
        className: "bg-green-500 text-white",
      };
    case "UNDER_CONSTRUCTION":
      return {
        label: "Under Construction",
        className: "bg-amber-500 text-white",
      };
    case "SOLD":
      return {
        label: "Sold",
        className: "bg-red-500 text-white",
      };
    case "PENDING":
      return {
        label: "Pending",
        className: "bg-orange-500 text-white",
      };
    case "RESERVED":
      return {
        label: "Reserved",
        className: "bg-purple-500 text-white",
      };
    case "MOVE_IN_READY":
      return {
        label: "Move-In Ready",
        className: "bg-green-600 text-white",
      };
    case "COMING_SOON":
      return {
        label: "Coming Soon",
        className: "bg-blue-500 text-white",
      };
    default:
      return {
        label: status.replace(/_/g, " "),
        className: "bg-gray-500 text-white",
      };
  }
}
