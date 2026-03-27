import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactModalProvider } from "@/lib/contact-modal-context";
import { ContentSiteLayout } from "@/components/layout/ContentSiteLayout";

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      <Header />
      <ContentSiteLayout>
        {children}
      </ContentSiteLayout>
      <Footer />
    </ContactModalProvider>
  );
}
