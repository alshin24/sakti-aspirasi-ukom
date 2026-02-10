import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  className?: string;
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  className,
  tagline = "Suara Aspirasi Kita - SAKTI",
  menuItems = [
    {
      title: "Tentang",
      links: [
        { text: "About Us", url: "/about" },
        { text: "Contact", url: "/contact" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Instagram", url: "#" },
        { text: "TikTok", url: "#" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} SAKTI. All rights reserved.`,
  bottomLinks = [
    { text: "Privacy Policy", url: "#" },
    { text: "Terms", url: "#" },
  ],
}: Footer2Props) => {
  return (
    <footer className={cn("border-t bg-background py-10 lg:py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
          
          {/* Bagian Branding: Full width di HP */}
          <div className="md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">SAKTI</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {tagline}. Wadah resmi aspirasi dan pengaduan fasilitas sekolah.
            </p>
          </div>

          {/* Bagian Menu: Otomatis tumpuk di HP, sejajar di PC */}
          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href={link.url} 
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Garis Bawah & Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row md:text-left">
          <p className="text-center text-xs text-muted-foreground md:text-left">
            {copyright}
          </p>
          <ul className="flex flex-wrap justify-center gap-6">
            {bottomLinks.map((link, linkIdx) => (
              <li key={linkIdx}>
                <a 
                  href={link.url} 
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export { Footer2 };
