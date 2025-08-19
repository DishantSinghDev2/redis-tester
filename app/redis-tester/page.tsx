import { RedisConnectionTester } from "@/components/redis-connection-tester"
import { UserGuide } from "@/components/user-guide"
import { TroubleshootingGuide } from "@/components/troubleshooting-guide"
import { ApiDocumentation } from "@/components/api-documentation"
import { PrivacySecurityNotice } from "@/components/privacy-security-notice"
import { PrivacyPolicy } from "@/components/privacy-policy"
import { TermsOfService } from "@/components/terms-of-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Redis Connection Tester</h1>
          <p className="text-center mt-2 text-primary-foreground/80">
            Test your Redis connections online with just a few clicks
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <PrivacySecurityNotice />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Connection Tester */}
          <div>
            <RedisConnectionTester />
          </div>

          {/* Documentation Tabs */}
          <div>
            <Tabs defaultValue="guide" className="w-full">
              <TabsList className="grid w-full grid-cols-5 text-xs">
                <TabsTrigger value="guide">Guide</TabsTrigger>
                <TabsTrigger value="troubleshooting">Help</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
              </TabsList>
              <TabsContent value="guide" className="mt-6">
                <UserGuide />
              </TabsContent>
              <TabsContent value="troubleshooting" className="mt-6">
                <TroubleshootingGuide />
              </TabsContent>
              <TabsContent value="api" className="mt-6">
                <ApiDocumentation />
              </TabsContent>
              <TabsContent value="privacy" className="mt-6">
                <PrivacyPolicy />
              </TabsContent>
              <TabsContent value="terms" className="mt-6">
                <TermsOfService />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Redis Connection Tester - Simple, fast, and reliable Redis testing</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} DishIs Technologies</span>
              <span>•</span>
              <a
                href="https://dishis.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                dishis.tech
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
              This tool processes all data locally in your browser. No information is sent to our servers. Use
              responsibly and only with systems you own or have permission to test.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
