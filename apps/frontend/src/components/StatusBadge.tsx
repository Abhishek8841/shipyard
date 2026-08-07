import type { DeploymentStatus } from "../types";
import "./StatusBadge.css";

const STATUS_CLASS: Record<DeploymentStatus, string> = {
  READY: "badge-ready",
  BUILDING: "badge-progress",
  DEPLOYING: "badge-progress",
  QUEUED: "badge-progress",
  PENDING: "badge-pending",
  FAILED: "badge-failed",
};

export default function StatusBadge({ status }: { status: DeploymentStatus }) {
  return (
    <span className={`badge ${STATUS_CLASS[status]}`}>
      {status}
    </span>
  );
}
