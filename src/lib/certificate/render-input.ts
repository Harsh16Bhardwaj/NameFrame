import { CertificateTemplateRole } from "@/generated/prisma/enums";

export type RenderCertificateInput = {
  event: {
    id: string;
    title: string;
    description?: string | null;
    organizationName?: string | null;
    organizationLogoUrl?: string | null;
    certificateTitle?: string | null;
    location?: string | null;
  };
  participant: {
    id: string;
    name: string;
    email: string;
  };
  role: CertificateTemplateRole;
  templateUrl: string;
  editorConfig: {
    textPosition: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    font: {
      family: string;
      size: number;
      color: string;
    };
  };
  verificationCode: string;
};

type RoleTemplateLike = Partial<Record<Lowercase<CertificateTemplateRole>, { backgroundUrl: string }>>;

export function resolveTemplateUrlByRole(input: {
  role: CertificateTemplateRole;
  roleTemplates?: RoleTemplateLike;
  fallbackTemplateUrl?: string | null;
}) {
  const roleKey = input.role.toLowerCase() as Lowercase<CertificateTemplateRole>;
  const roleTemplate = input.roleTemplates?.[roleKey]?.backgroundUrl;

  if (roleTemplate) return roleTemplate;
  if (input.fallbackTemplateUrl) return input.fallbackTemplateUrl;

  throw new Error(`No template found for role ${input.role}`);
}
