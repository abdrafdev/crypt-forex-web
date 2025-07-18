import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Monitor, Smartphone, Tablet } from "lucide-react";

interface UserSession {
    id: string;
    deviceInfo: string;
    location: string;
    lastActivity: string;
    createdAt: string;
    isCurrentSession: boolean;
}

interface SessionsResponse {
    success: boolean;
    sessions: UserSession[];
    totalSessions: number;
}

export function UserSessions() {
    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [terminating, setTerminating] = useState<string | null>(null);
    const [showDebug, setShowDebug] = useState(false);
    const { data: session, status } = useSession();

    const fetchSessions = async () => {
        try {
            if (status === "loading") {
                return;
            }

            if (!session?.user?.id) {
                setLoading(false);
                return;
            }

            // For NextAuth, we need to create an API that works with the user ID from the session
            // We'll create a new endpoint that doesn't require JWT tokens
            const response = await fetch(`/api/user/sessions-by-id?userId=${session.user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: SessionsResponse = await response.json();
                setSessions(data.sessions);
            } else {
                const errorData = await response.json();
                console.error("Failed to fetch sessions:", errorData);
            }
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    const terminateSession = async (sessionId: string) => {
        try {
            setTerminating(sessionId);

            if (!session?.user?.id) {
                return;
            }

            const response = await fetch(`/api/user/sessions-by-id?sessionId=${sessionId}&userId=${session.user.id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setSessions(sessions.filter(s => s.id !== sessionId));
            } else {
                console.error("Failed to terminate session");
            }
        } catch (error) {
            console.error("Error terminating session:", error);
        } finally {
            setTerminating(null);
        }
    };

    // Debug function to create a test session
    const createTestSession = async () => {
        if (!session?.user?.id) {
            return;
        }

        try {
            const response = await fetch("/api/debug/create-test-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: session.user.id }),
            });

            if (response.ok) {
                fetchSessions(); // Refresh sessions
            } else {
                console.error("Failed to create test session");
            }
        } catch (error) {
            console.error("Error creating test session:", error);
        }
    };

    useEffect(() => {
        if (status !== "loading") {
            fetchSessions();
        }
    }, [status, session]);

    const getDeviceIcon = (deviceInfo: string) => {
        if (deviceInfo.includes("Mobile")) return <Smartphone className="h-4 w-4" />;
        if (deviceInfo.includes("Tablet")) return <Tablet className="h-4 w-4" />;
        return <Monitor className="h-4 w-4" />;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-3">
                        <div className="h-16 bg-gray-200 rounded"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold">Active Sessions</h3>
                    <p className="text-sm text-gray-600">
                        Manage your active login sessions across devices
                    </p>
                    {/* Debug information */}
                    {session?.user?.id && (
                        <p className="text-xs text-blue-600 mt-1">
                            Debug: User ID: {session.user.id}
                        </p>
                    )}
                    {showDebug && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                            <p><strong>NextAuth Status:</strong> {status}</p>
                            <p><strong>Session Email:</strong> {session?.user?.email || "None"}</p>
                            <p><strong>Session User ID:</strong> {session?.user?.id || "None"}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={createTestSession}
                                className="mt-2"
                            >
                                Create Test Session
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="ml-2">
                        {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchSessions}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDebug(!showDebug)}
                        className="text-gray-500"
                    >
                        Debug
                    </Button>
                </div>
            </div>

            {sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Monitor className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No active sessions found</p>
                    <p className="text-sm mt-2">
                        {session?.user?.id ? "Try refreshing or check the browser console for errors" : "Please log in to view sessions"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    {getDeviceIcon(session.deviceInfo)}
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <p className="font-medium">{session.deviceInfo}</p>
                                        {session.isCurrentSession && (
                                            <Badge variant="default" className="text-xs">
                                                Current
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {session.location} • Last active {getTimeAgo(session.lastActivity)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Started {formatDate(session.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => terminateSession(session.id)}
                                disabled={terminating === session.id || session.isCurrentSession}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                {terminating === session.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Debug section */}
            {showDebug && (
                <div className="mt-6 p-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">
                        Debug Actions
                    </h4>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={createTestSession}
                    >
                        Create Test Session
                    </Button>
                </div>
            )}
        </Card>
    );
}
