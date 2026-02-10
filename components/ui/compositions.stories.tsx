import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';
import { Badge } from './badge';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

// ===== COMPOSED COMPONENTS =====

export const UserProfile: StoryObj = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle>John Doe</CardTitle>
          <p className="text-sm text-muted-foreground">Product Designer</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">john@example.com</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="mr-2">Edit</Button>
        <Button>Message</Button>
      </CardFooter>
    </Card>
  ),
};

export const DealsCard: StoryObj = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Deal Name</CardTitle>
          <Badge variant="default">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Amount:</span>
          <span className="font-medium">$50,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Owner:</span>
          <span className="font-medium">Sarah Smith</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">Details</Button>
        <Button className="flex-1">Move</Button>
      </CardFooter>
    </Card>
  ),
};

export const MobileProfile: StoryObj = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">User Name</p>
            <p className="text-xs text-muted-foreground">Email</p>
          </div>
        </CardHeader>
        <CardFooter className="gap-2 p-4">
          <Button variant="outline" className="flex-1 text-xs">Edit</Button>
          <Button className="flex-1 text-xs">Message</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobileSE' } },
};

export const TabsWithContent: StoryObj = {
  render: () => (
    <Card className="w-full">
      <Tabs defaultValue="deals" className="w-full">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="deals" className="flex-1">Deals</TabsTrigger>
          <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
        </TabsList>
        <TabsContent value="deals" className="p-4 space-y-3">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Deal 1</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Deal 2</CardTitle>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="contacts" className="p-4">
          <p>Contacts list</p>
        </TabsContent>
      </Tabs>
    </Card>
  ),
};

export const DarkComposed: StoryObj = {
  render: () => (
    <div className="dark bg-slate-950 p-8 rounded">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>DK</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Dark Mode</CardTitle>
            <p className="text-sm text-muted-foreground">Works great</p>
          </div>
        </CardHeader>
        <CardContent>
          <Badge>All components</Badge>
        </CardContent>
      </Card>
    </div>
  ),
};
