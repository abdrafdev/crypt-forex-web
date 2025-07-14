'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function ProfilePage() {

  return (
      <DashboardLayout>
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                {/* Avatar */}
                <div>
                  <h2 className="text-2xl font-semibold">
                    Muhammad Naveed
                  </h2>
                  <p className="text-gray-500">muhammadnaveedcis@gmail.com</p>
                </div>
              </div>

              <form className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"

                            placeholder="John"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"

                            placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                          id="username"

                          placeholder="johndoe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                          id="email"
                          type="email"

                          placeholder="john.doe@example.com"
                      />
                    </div>

                    <Button type="submit" className="w-full">

                    </Button>
                  </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span>
                </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email Status</span>
                  <span>
                </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
  );
}