import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';
import { Badge } from './badge';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

// ===== FORM LAYOUTS =====

export const LoginForm: StoryObj = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input className="w-full border rounded px-3 py-2" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Login</Button>
      </CardFooter>
    </Card>
  ),
};

export const LoginFormMobile: StoryObj = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input className="w-full border rounded px-3 py-2 text-sm" type="email" placeholder="Email" />
          <input className="w-full border rounded px-3 py-2 text-sm" type="password" placeholder="Password" />
        </CardContent>
        <CardFooter>
          <Button className="w-full">Login</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

// ===== DATA DISPLAY PATTERNS =====

export const StatsCard: StoryObj = {
  render: () => (
    <Card className="w-72">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-muted-foreground">Total Revenue</p>
          <p className="text-4xl font-bold mt-2">$124,500</p>
          <Badge className="mt-4">+12% from last month</Badge>
        </div>
      </CardContent>
    </Card>
  ),
};

export const TableRow: StoryObj = {
  render: () => (
    <div className="w-full">
      <Card>
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <div>
            <p className="font-medium">Item Name</p>
            <p className="text-sm text-muted-foreground">Description</p>
          </div>
          <div className="text-right">
            <p className="font-medium">$1,234</p>
            <Badge>Active</Badge>
          </div>
        </div>
      </Card>
    </div>
  ),
};

// ===== NAVIGATION PATTERNS =====

export const TabNavigation: StoryObj = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <p>Overview content</p>
      </TabsContent>
      <TabsContent value="details">
        <p>Details content</p>
      </TabsContent>
      <TabsContent value="settings">
        <p>Settings content</p>
      </TabsContent>
    </Tabs>
  ),
};

// ===== EMPTY STATES =====

export const EmptyState: StoryObj = {
  render: () => (
    <Card className="w-96">
      <CardContent className="pt-12 text-center">
        <p className="text-muted-foreground mb-4">No items found</p>
        <Button>Create Item</Button>
      </CardContent>
    </Card>
  ),
};

// ===== ALERT PATTERNS =====

export const SuccessAlert: StoryObj = {
  render: () => (
    <Alert className="w-96 border-green-500">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>Your action completed successfully.</AlertDescription>
    </Alert>
  ),
};

export const ErrorAlert: StoryObj = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong. Please try again.</AlertDescription>
    </Alert>
  ),
};

// ===== MOBILE LAYOUTS =====

export const MobileNavBar: StoryObj = {
  render: () => (
    <div className="w-80 border-t">
      <div className="flex justify-around p-2">
        <Button variant="ghost" size="sm">Home</Button>
        <Button variant="ghost" size="sm">Search</Button>
        <Button variant="ghost" size="sm">Profile</Button>
      </div>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const MobileCard: StoryObj = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mobile Card</CardTitle>
        </CardHeader>
        <CardContent>Content fits mobile</CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" className="flex-1">Cancel</Button>
          <Button className="flex-1">Save</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

// ===== DARK MODE PATTERNS =====

export const DarkModeCard: StoryObj = {
  render: () => (
    <div className="dark bg-slate-950 p-8 rounded">
      <Card>
        <CardHeader>
          <CardTitle>Dark Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Component in dark mode</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const DarkModeForm: StoryObj = {
  render: () => (
    <div className="dark bg-slate-950 p-8 rounded w-96">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <input className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" type="text" placeholder="Input" />
          <Button className="w-full">Submit</Button>
        </CardContent>
      </Card>
    </div>
  ),
};
