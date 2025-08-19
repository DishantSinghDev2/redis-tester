import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PrivacyPolicy() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Policy</CardTitle>
        <CardDescription>How we handle your data and privacy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <section>
          <h3 className="font-semibold mb-2">Data Collection</h3>
          <p>
            We do not collect, store, or transmit any personal data or Redis connection details to our servers. All
            processing happens locally in your browser.
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Local Storage</h3>
          <p>
            Connection details may be temporarily stored in your browser's local storage for convenience. This data
            never leaves your device and can be cleared at any time using the "Clear All Browser Data" button.
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Third-Party Services</h3>
          <p>
            This tool makes direct connections from your browser to your specified Redis servers. We are not involved in
            these connections and do not have access to the data transmitted.
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Analytics</h3>
          <p>
            We do not use any analytics, tracking, or monitoring services. Your usage of this tool is completely
            private.
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Security Recommendations</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Only use test or development Redis instances</li>
            <li>Never enter production credentials</li>
            <li>Use HTTPS when accessing this tool</li>
            <li>Clear browser data after use if on a shared computer</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  )
}
