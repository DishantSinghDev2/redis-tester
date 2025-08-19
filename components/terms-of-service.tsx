import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TermsOfService() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
        <CardDescription>Terms and conditions for using this tool</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <section>
          <h3 className="font-semibold mb-2">Acceptance of Terms</h3>
          <p>By using this Redis Connection Tester, you agree to these terms and conditions.</p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Use at Your Own Risk</h3>
          <p>This tool is provided "as is" without any warranties. You are solely responsible for:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>The security of your Redis credentials</li>
            <li>Any data you choose to test with</li>
            <li>Compliance with your organization's security policies</li>
            <li>Any consequences of using this tool</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Prohibited Uses</h3>
          <p>You may not use this tool to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>Test production systems without proper authorization</li>
            <li>Attempt to access systems you don't own or have permission to test</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Interfere with the tool's operation</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Limitation of Liability</h3>
          <p>
            DishIs Technologies and the tool creators are not liable for any damages, data loss, security breaches, or
            other issues that may arise from using this tool.
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Changes to Terms</h3>
          <p>
            These terms may be updated at any time. Continued use of the tool constitutes acceptance of any changes.
          </p>
        </section>
      </CardContent>
    </Card>
  )
}
