import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Trash2} from "lucide-react";

export function DeleteDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center justify-between text-red-600 cursor-pointer">
                    <div>
                        <p className="font-medium">Delete My Account</p>
                        <p className="text-sm text-red-500">Bad things happens</p>
                    </div>
                    <Trash2 className="w-5 h-5" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-white/80 backdrop-blur-2xl">
                <DialogHeader>
                    <DialogTitle className="flex justify-center">
                       Delete My Account
                    </DialogTitle>
                    <DialogDescription className="flex justify-center">
                        Are you sure? This Action cannot be undone. Once, you delete your account, you will not be able to recover it.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <div className={'flex  gap-2 w-full'}>
                        <DialogClose asChild>
                            <Button variant="outline" className={'w-1/2'}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" className={'w-1/2'}>
                            Delete all items?
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}