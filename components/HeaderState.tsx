"use client";

import { useState } from "react";
import HeaderClient from "./HeaderClient";

type Props = {
  user: any;
  settings?: Record<string, string>;
  unreadMessageCount?: number;
};

export default function HeaderState({
  user,
  settings,
  unreadMessageCount,
}: Props) {
  const [search, setSearch] = useState("");

  return (
    <HeaderClient
      search={search}
      setSearch={setSearch}
      user={user}
      settings={settings}
      unreadMessageCount={unreadMessageCount}
    />
  );
}