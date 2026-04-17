"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ContactInfo() {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Contact Information</h2>
      <Input disabled value="4427 Richard Dr, Los Angeles CA 90032" placeholder="Contact Address" />
    </Card>
  );
}
