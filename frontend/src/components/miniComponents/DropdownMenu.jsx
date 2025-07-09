import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import { Link } from 'react-router-dom';

function DropdownMenu({ title, subheading = [], active = false }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <p className={`font-semibold  ${active ? 'text-[#e65c4f]' : 'text-black'}`}>{title}</p>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className={`grid w-[200px] gap-3 md:w-[300px] md:grid-cols-1 lg:w-[400px] `}>
              {subheading.length > 0 ? (
                subheading.map((heading, index) => (
                  <Link
                    key={index}
                    to={heading.route}
                    className="block p-4 hover:bg-[#f5f5f5] rounded-md"
                  >
                    {heading.name}
                  </Link>
                ))
              ) : (
                <p className="p-4 text-gray-500">No options available</p>
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default DropdownMenu;
