import React from "react";

interface AvatarProps {
  player: {
    id: string;
  };
}

export function Avatar({ player }: AvatarProps) {
  return (
    <img
      className="h-full w-full rounded-md shadow bg-white p-1"
      src={`https://avatars.dicebear.com/api/identicon/${player.id}.svg`}
      alt="Avatar"
    />
  );
}
