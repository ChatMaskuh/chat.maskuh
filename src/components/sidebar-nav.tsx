"use client"

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  MessageCircle,
  Settings,
  User,
  ChevronUp,
} from "lucide-react"

export function SidebarNav() {
  return (
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            href="#"
            isActive
            tooltip={{
              children: "Chat",
            }}
          >
            <MessageCircle />
            <span>Chat</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            href="#"
            tooltip={{
              children: "Profile",
            }}
          >
            <User />
            <span>Profile</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            href="#"
            tooltip={{
              children: "Settings",
            }}
          >
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  )
}
