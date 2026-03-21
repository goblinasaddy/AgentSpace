import Link from 'next/link';
import { Star, GitFork, MessageSquare, Code, Terminal, Clock, GitPullRequest, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Agent } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const getTypeIcon = () => {
    switch (agent.type) {
      case 'chat': return <MessageSquare className="h-3 w-3" />;
      case 'input-output': return <Terminal className="h-3 w-3" />;
      case 'example': return <Code className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className="agent-card-hover bg-card/50 border-muted-foreground/10 overflow-hidden flex flex-col h-full">
      <CardHeader className="p-4 pb-2 space-y-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5 border border-muted-foreground/20">
              <AvatarFallback className="bg-muted">
                <User className="h-3 w-3 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground hover:underline cursor-pointer">
              {agent.owner}
            </span>
          </div>
          <Badge variant="outline" className="text-[9px] gap-1 py-0 px-1.5 h-5 uppercase font-bold text-muted-foreground bg-muted/30">
            {getTypeIcon()}
            {agent.type}
          </Badge>
        </div>
        <Link href={`/agent/${agent.id}`} className="block mt-2 group">
          <h3 className="font-headline font-bold text-lg group-hover:text-primary transition-colors truncate">
            {agent.name}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
          {agent.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary-foreground/90 border-none text-[10px] py-0 px-2 font-medium">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span>{agent.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            <span>{agent.forks}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Clock className="h-3 w-3" />
            <span>{agent.updatedAt}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t border-muted/30 mt-auto bg-muted/20">
        <Button variant="ghost" className="w-full justify-between h-9 px-2 text-xs font-medium text-muted-foreground hover:text-foreground" asChild>
          <Link href={`/profile/${agent.owner}#contributions`}>
            Contributions
            <GitPullRequest className="h-3 w-3 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
