const fs = require('fs');
let code = fs.readFileSync('app/(main)/messages/page.tsx', 'utf-8');

const emptyChatOld = `                  <h3 className="font-semibold mb-2">Start the conversation</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Ask the seller about this product. Use quick replies below
                    to get started.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-md">
                    {quickReplies.map((reply) => (
                      <Button
                        key={reply}
                        variant="outline"
                        size="sm"
                        onClick={() => setMessage(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>`;

const emptyChatNew = `                  <h3 className="font-semibold mb-2">
                    {user?.id === activeConversation.buyerId ? "Start the conversation" : "No messages yet"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    {user?.id === activeConversation.buyerId 
                      ? "Ask the seller about this product. Use quick replies below to get started."
                      : "Waiting for the buyer to send the first message."}
                  </p>
                  {user?.id === activeConversation.buyerId && (
                    <div className="flex flex-wrap justify-center gap-2 max-w-md">
                      {quickReplies.map((reply) => (
                        <Button
                          key={reply}
                          variant="outline"
                          size="sm"
                          onClick={() => setMessage(reply)}
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}`;

if (code.includes(emptyChatOld)) {
    code = code.replace(emptyChatOld, emptyChatNew);
    console.log("Replaced empty chat");
} else {
    console.log("Could not find emptyChatOld text");
}

const quickRepliesOld = `{/* Quick Replies */}
            {activeConversation.messages.length > 0 && (`;
const quickRepliesNew = `{/* Quick Replies */}
            {activeConversation.messages.length > 0 && user?.id === activeConversation.buyerId && (`;

if (code.includes(quickRepliesOld)) {
    code = code.replace(quickRepliesOld, quickRepliesNew);
    console.log("Replaced quick replies bottom");
} else {
    console.log("Could not find quickRepliesOld text");
}

fs.writeFileSync('app/(main)/messages/page.tsx', code);
