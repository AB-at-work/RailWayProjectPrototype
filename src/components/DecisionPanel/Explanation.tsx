import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import { ScrollArea } from "@/components/UI/scroll-area"
import { BrainCircuit, Bot } from "lucide-react"

// This component is now a stateful, intelligent mouthpiece for our AI.
interface ExplanationProps {
  log: string[] | undefined;
  isLoading: boolean;
}

export default function Explanation({ log, isLoading }: ExplanationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Rationale</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {isLoading ? (
              // A specific loading state for when the AI is thinking.
              <div className="flex items-center space-x-2 text-muted-foreground">
                <BrainCircuit className="h-5 w-5 animate-spin" />
                <span>AI is analyzing network conflicts...</span>
              </div>
            ) : log && log.length > 0 ? (
              // When a log exists, it is rendered as a step-by-step list.
              <ul className="space-y-2">
                {log.map((entry, index) => (
                  <li key={index} className="flex items-start">
                    <Bot className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-primary" />
                    <span>{entry}</span>
                  </li>
                ))}
              </ul>
            ) : (
              // The default state, inviting the user to take action.
              <p className="text-muted-foreground">
                Click "Optimize Schedule" to generate an optimized plan and see the AI's step-by-step reasoning.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

