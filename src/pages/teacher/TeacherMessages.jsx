import React from "react";
import { Panel, StudentHero } from "../../components/student/StudentUi";

export default function TeacherMessages({ type = "inbox" }) {
  const isInbox = type === "inbox";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Messages"
        title={isInbox ? "Inbox" : "Sent Messages"}
        subtitle={isInbox ? "Messages from admin and students will appear here." : "Messages you have sent to students or admin."}
      />

      <Panel title={isInbox ? "Inbox" : "Sent"}>
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500">
          {isInbox ? "No messages in your inbox yet." : "You have not sent any messages yet."}
        </div>
      </Panel>
    </div>
  );
}
