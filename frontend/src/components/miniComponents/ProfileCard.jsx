import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileCard({ name = "name", role = "role", avatar = "avatar" }) {
  return (
    <div className="bg-white border rounded-lg p-2 px-4 w-fit border-gray-400 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {name}
          </h2>
          <p className="text-gray-700">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}