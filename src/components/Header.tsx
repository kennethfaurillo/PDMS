import { useAuth } from "@/hooks/useAuth";
import { capitalize } from "@/lib/utils";
import axios from "axios";
import { BarChartHorizontal, CloudIcon, FileClockIcon, GithubIcon, LifeBuoyIcon, Loader2Icon, LogOutIcon, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


function Header(props) {
    const { user, token, logout } = useAuth()
    const [logoutAlertOpen, setLogoutAlertOpen] = useState(false)
    const [eventlogsDialogOpen, setEventlogsDialogOpen] = useState(false)
    const [sheetOpen, setSheetOpen] = useState(false)
    const [eventLogs, setEventLogs] = useState([])
    const eventTypeColorMap = {
        Authentication: 'text-blue-500/80',
        EditProfile: 'text-green-500/80',
        EditLogger: 'text-orange-500/80',
        Report: 'text-yellow-500'
    }
    const dashboardPrefs = props.dashboardPrefs
    const setDashboardPrefs = props.setDashboardPrefs

    useEffect(() => {
        return () => {
            setEventLogs([])
        }
    }, [])

    const fetchEventLogs = async () => {
        const eventLogResponse = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/auth/event_log?userId=${user.UserId}&token=${token}`)
        setEventLogs(eventLogResponse.data)
        return
    }

    return (
        <>
            <AlertDialog open={logoutAlertOpen} onOpenChange={setLogoutAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                        <Separator className="bg-piwad-blue-500" />
                        <AlertDialogDescription>
                            Are you sure you want to log out? You will need to log in again to access your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant={"destructive"} onClick={async () => { await logout() }}>Log Out</Button>
                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={eventlogsDialogOpen} onOpenChange={setEventlogsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-piwad-blue-500">System Event Logs</DialogTitle>
                        <DialogDescription>Only Admins can view these Logs</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[70dvh] rounded-md border p-4 font-sans">
                        {eventLogs.length ?
                            eventLogs.map((log) => (
                                <>
                                    <div className="flex justify-between">
                                        <div className="text-[.66rem] text-slate-800/80 ml-0">{(new Date(log.Timestamp)).toLocaleString()} </div>
                                        <div className="text-[.66rem] text-blue-700/80 mr-2">{log.IpAddress}</div>
                                    </div>
                                    <div key={log.LogId} className={`text-sm ${eventTypeColorMap[log.EventType] ?? "text-black"}`}>
                                        {log.Message}
                                    </div>
                                    <Separator className="my-2" />
                                </>
                            )) :
                            <div className="justify-center flex-col h-[50vh] text-red-500/90 font-semibold">
                                <Loader2Icon className="animate-spin size-24 mx-auto h-full "/>
                            </div>}
                    </ScrollArea>
                    <DialogClose asChild><Button>Close</Button></DialogClose>
                </DialogContent>
            </Dialog>

            <div className='flex gap-4 sticky top-0 max-w-dvw bg-piwad-lightblue-700/100 backdrop-blur drop-shadow-xl z-10 max-h-12 sm:max-h-20 overflow-hidden'>
                <div className="flex gap-2 p-1 items-center">
                    <a href="/">
                        <Avatar className='m-1 ml-2 size-9 sm:size-14'>
                            <AvatarImage src='src/assets/piwad_logo.png' />
                            <AvatarFallback className='text-xs'>PIWAD</AvatarFallback>
                        </Avatar>
                    </a>
                    <div className="flex">
                    <h2 className="scroll-m-20 md:block text-3xl font-sans tracking-tight first:mt-0 text-slate-100 ">PIWAD</h2>
                    <h2 className="md:block text-3xl text-blue-200 ml-2">Aqua</h2>
                    <h2 className="md:block text-3xl text-yellow-500 ">OPS</h2>
                    </div>
                    {/* <h2 className="scroll-m-20 hidden md:block text-3xl font-sans tracking-tight first:mt-0 text-slate-100 ">PIWAD AquaOPS</h2> */}
                </div>
                <div className="flex ml-auto">
                    {props.user ? <>
                        <TooltipProvider>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger className="flex gap-1 text-slate-50 text-2xl items-center outline-none">
                                    <>
                                        {/* <div className="text-slate-50 text-2xl lg:hidden">{props.user.FirstName.at(0).toUpperCase() ?? "F"}{props.user.LastName.at(0).toUpperCase() ?? "L"}</div> */}
                                        {/* <div className="text-slate-50 hidden text-3xl lg:block 2xl:hidden">{props.user.FirstName ?? "Firstname"} {props.user.LastName.at(0).toUpperCase() ?? "L"}.</div> */}
                                        <div className="text-slate-50 text-2xl lg:block">{capitalize(user.Username) ?? "L"}</div>
                                        {/* <div className="text-slate-50 hidden text-3xl 2xl:block">{props.user.FirstName ?? "Firstname"} {capitalize(props.user.LastName) ?? "Lastname"}</div> */}
                                        <Avatar className="m-2 mr-4 size-9 sm:size-14 cursor-pointer" >
                                            <AvatarImage src={`src/assets/${user.Type == "admin" ? "software-engineer" : "engineer"}.png`}/>
                                            <AvatarFallback>User</AvatarFallback>
                                        </Avatar>
                                    </>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem disabled>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem disabled>
                                            <BarChartHorizontal className="mr-2 h-4 w-4" />
                                            <span>Statistics</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={setSheetOpen}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => window.open('https://github.com/kennethfaurillo/PDMS', '_blank')?.focus()}>
                                        <GithubIcon className="mr-2 h-4 w-4" />
                                        <span>GitHub</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        <LifeBuoyIcon className="mr-2 h-4 w-4" />
                                        <span>Support</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        <CloudIcon className="mr-2 h-4 w-4" />
                                        <span>API</span>
                                    </DropdownMenuItem>
                                    <Tooltip delayDuration={200}>
                                        <TooltipTrigger className="cursor-default w-full">
                                            <DropdownMenuItem onSelect={() => {
                                                fetchEventLogs()
                                                setEventlogsDialogOpen(true)
                                            }} disabled={user.Type != "admin"}>
                                                    <FileClockIcon className="mr-2 h-4 w-4" />
                                                    <span>System Event Logs</span>
                                            </DropdownMenuItem>
                                        </TooltipTrigger>
                                        {user.Type != "admin" ?
                                        <TooltipContent>
                                            <p>{capitalize(user.Type)} not authorized to view System Logs</p>
                                        </TooltipContent> : 
                                        null
                                        }
                                    </Tooltip>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={setLogoutAlertOpen}>
                                        <LogOutIcon className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TooltipProvider>
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetContent className="backdrop-blur-md rounded-l-xl ">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center text-2xl gap-2">
                                        <Avatar className="m-2 mr-2 size-14 sm:size-16">
                                            <AvatarImage src={`src/assets/${user.Type == "admin" ? "software-engineer" : "engineer"}.png`} />
                                            <AvatarFallback>User</AvatarFallback>
                                        </Avatar>
                                        <div className="grid grid-cols-2">
                                            <div className="col-span-2">{capitalize(user.Username)}</div>
                                            <div className="col-span-1 text-sm text-piwad-lightyellow-600/80 ">{(user.Type).toUpperCase() ?? "UserType"}</div>
                                        </div>
                                    </SheetTitle>
                                    <Separator />
                                    <SheetDescription className="w-full text-left pb-2">
                                        Change Setttings for {capitalize(user.Type)} {capitalize(user.Username)}
                                    </SheetDescription>
                                </SheetHeader>

                                <Tabs defaultValue="general">
                                    <TabsList className="grid grid-cols-3 w-full mr-1">
                                        <TabsTrigger value="general">General</TabsTrigger>
                                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                                        <TabsTrigger value="account">Account</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="general">
                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle>General</CardTitle>
                                                <CardDescription>Edit your preferences</CardDescription>
                                                <Separator />
                                            </CardHeader>
                                            <CardContent>
                                                <div>
                                                    <Checkbox id="cbNotifications" /> <Label htmlFor="cbNotifications" className="cursor-pointer">Enable Notifications</Label>
                                                </div>
                                                <div>
                                                    <Checkbox id="cbDarkMode" /> <Label htmlFor="cbDarkMode" className="cursor-pointer">Dark Mode</Label>
                                                </div>
                                                <div>
                                                    <Checkbox id="cbAutoUpdate" disabled /> <Label htmlFor="cbAutoUpdate" className="cursor-pointer">Auto-Update</Label>
                                                </div>
                                                <div>
                                                    <Checkbox id="cbTwoFactor" disabled /> <Label htmlFor="cbTwoFactor" className="cursor-pointer">Enable Two-Factor Authentication</Label>
                                                </div>
                                                <div className="flex justify-end">
                                                    <Button className="mt-2 ml-2 bg-green-500/80 text-white" disabled>Save</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="account">
                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle>Account</CardTitle>
                                                <CardDescription>Edit your account details</CardDescription>
                                                <Separator />
                                            </CardHeader>
                                            <CardContent className="relative">
                                                <div className="mb-2">
                                                    <Label htmlFor="changeDisplayName" className="cursor-pointer">Change Display Name</Label>
                                                    <Input id="changeDisplayName" placeholder="Enter new display name" />
                                                </div>
                                                <div className=" mb-2">
                                                    <Label htmlFor="changeProfilePicture" className="cursor-pointer">Change Profile Picture</Label>
                                                    <Input type="file" id="changeProfilePicture" accept="image/*" />
                                                </div>
                                                <div className="mt-2 mb-2">
                                                    <Label htmlFor="changeUsername" className="cursor-pointer">Change Username</Label>
                                                    <Input id="changeUsername" type="password" placeholder="Enter new username" disabled />
                                                </div>
                                                <div className="mt-2 mb-2">
                                                    <Label htmlFor="changePassword" className="cursor-pointer">Change Password</Label>
                                                    <Input id="changePassword" type="password" placeholder="Enter new password" disabled />
                                                </div>
                                                <div className="flex justify-end">
                                                    <Button className="mt-2 bg-green-500/80 text-white" disabled>Save</Button>
                                                    <Button variant="destructive" className="ml-2 mt-2 text-black" disabled>Delete Account</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="dashboard">
                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle>Dashboard</CardTitle>
                                                <CardDescription>Edit your dashboard</CardDescription>
                                                <Separator />
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="flex space-x-2 items-center">
                                                    <Switch id="swDataloggerList" checked={dashboardPrefs.showLoggerList} onCheckedChange={() => setDashboardPrefs({ ...dashboardPrefs, showLoggerList: !dashboardPrefs.showLoggerList })} /> <Label htmlFor="swDataloggerList" className="cursor-pointer">Datalogger List</Label>
                                                </div>
                                                <div className="flex space-x-2 items-center">
                                                    <Switch id="swDataloggerMap" checked={dashboardPrefs.showLoggerMap} onCheckedChange={() => setDashboardPrefs({ ...dashboardPrefs, showLoggerMap: !dashboardPrefs.showLoggerMap })} /> <Label htmlFor="swDataloggerMap" className="cursor-pointer">Datalogger Map</Label>
                                                </div>
                                                <div className="flex space-x-2 items-center">
                                                    <Switch id="swTotalVolume" disabled /> <Label htmlFor="swTotalVolume" className="cursor-pointer">Total Volume for the Day</Label>
                                                </div>
                                                <div className="flex space-x-2 items-center">
                                                    <Switch id="swHighestFlow" disabled /> <Label htmlFor="swHighestFlow" className="cursor-pointer">Highest Flow</Label>
                                                </div>
                                                <div className="flex space-x-2 items-center">
                                                    <Switch id="swLowestFlow" disabled /> <Label htmlFor="swLowestFlow" className="cursor-pointer">Lowest Flow</Label>
                                                </div>
                                                <div className="flex space-x-2 items-center">
                                                    <Switch id="swHighestPressure" disabled /> <Label htmlFor="swHighestPressure" className="cursor-pointer">Highest Pressure</Label>
                                                </div>
                                                <div className="flex space-x-2 items-center">
                                                    <Switch id="swLowestPressure" disabled /> <Label htmlFor="swLowestPressure" className="cursor-pointer">Lowest Pressure</Label>
                                                </div>
                                                <div className="flex justify-end">
                                                    <Button className="mt-2 bg-green-500/80 text-white" disabled>Save</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                                <SheetFooter>
                                    <div className="absolute bottom-10 right-4 space-x-1.5 sm:space-x-2">
                                        <Button className="bg-piwad-lightyellow-500 text-black/90" onClick={() => {
                                            fetchEventLogs()
                                            setEventlogsDialogOpen(true)
                                        }}>Event Logs</Button>
                                        <Button variant={"destructive"} onClick={() => {
                                            setLogoutAlertOpen(true)
                                            setSheetOpen(false)
                                        }}>Log Out</Button>
                                        <SheetClose asChild >
                                            <Button>Close</Button>
                                        </SheetClose>
                                    </div>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </> : <></>}

                </div>
            </div>
        </>
    )
}

export default Header