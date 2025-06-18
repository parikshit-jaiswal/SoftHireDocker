import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    // SheetTrigger, // Remove trigger for controlled usage
} from "@/components/ui/sheet"

function MessageDrawer({ open, setOpen, children }) {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
                className="w-[800px] max-w-[100vw] p-0"
                side="right"
            >
                {children}
            </SheetContent>
        </Sheet>
    )
}

export default MessageDrawer
