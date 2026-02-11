import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppearance } from "@/hooks/use-appearance"

export function ModeToggle() {
    const { updateAppearance } = useAppearance()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-200">
                <DropdownMenuItem onClick={() => updateAppearance("light")} className="hover:bg-gray-800 focus:bg-gray-800 cursor-pointer">
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateAppearance("dark")} className="hover:bg-gray-800 focus:bg-gray-800 cursor-pointer">
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateAppearance("system")} className="hover:bg-gray-800 focus:bg-gray-800 cursor-pointer">
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
