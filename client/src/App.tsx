import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import ContentCreator from "@/pages/ContentCreator";
import Calendar from "@/pages/Calendar";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Layout from "@/components/Layout";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner during authentication check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - accessible to everyone */}
      <Route path="/" component={Landing} />
      
      {/* Protected routes with individual authentication checks */}
      <Route path="/dashboard" component={() => 
        isAuthenticated ? (
          <Layout>
            <Dashboard />
          </Layout>
        ) : (
          (() => { window.location.href = '/'; return null; })()
        )
      } />
      
      <Route path="/create" component={() => 
        isAuthenticated ? (
          <Layout>
            <ContentCreator />
          </Layout>
        ) : (
          (() => { window.location.href = '/'; return null; })()
        )
      } />
      
      <Route path="/calendar" component={() => 
        isAuthenticated ? (
          <Layout>
            <Calendar />
          </Layout>
        ) : (
          (() => { window.location.href = '/'; return null; })()
        )
      } />
      
      <Route path="/analytics" component={() => 
        isAuthenticated ? (
          <Layout>
            <Analytics />
          </Layout>
        ) : (
          (() => { window.location.href = '/'; return null; })()
        )
      } />
      
      <Route path="/settings" component={() => 
        isAuthenticated ? (
          <Layout>
            <Settings />
          </Layout>
        ) : (
          (() => { window.location.href = '/'; return null; })()
        )
      } />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
