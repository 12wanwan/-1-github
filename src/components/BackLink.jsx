import { Link } from "react-router-dom";
import { ArrowLineLeft } from "@phosphor-icons/react";

export default function BackLink() {
  return (
    <Link to="/" className="back-link">
      <ArrowLineLeft size={13} weight="bold" />
      返回首页
    </Link>
  );
}

