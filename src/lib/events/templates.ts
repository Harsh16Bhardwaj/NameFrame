import { CertificateTemplateRole } from "@/generated/prisma/enums";

export type RoleTemplateUrls = Partial<Record<Lowercase<CertificateTemplateRole>, string>>;

export function roleToResponseKey(role: CertificateTemplateRole) {
  return role.toLowerCase() as Lowercase<CertificateTemplateRole>;
}

export function groupTemplateBindings<T extends { role: CertificateTemplateRole; template: unknown }>(
  bindings: T[]
) {
  return bindings.reduce<Partial<Record<Lowercase<CertificateTemplateRole>, unknown>>>((acc, binding) => {
    acc[roleToResponseKey(binding.role)] = binding.template;
    return acc;
  }, {});
}
