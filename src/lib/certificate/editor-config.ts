export type CertificateEditorConfig = {
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

export type LegacyTemplateConfig = {
  textPositionX: number;
  textPositionY: number;
  textWidth: number;
  textHeight: number;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
};

export const DEFAULT_EDITOR_CONFIG: CertificateEditorConfig = {
  textPosition: {
    x: 50,
    y: 50,
    width: 80,
    height: 15,
  },
  font: {
    family: "Arial",
    size: 48,
    color: "#000000",
  },
};

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function normalizeEditorConfig(value: unknown): CertificateEditorConfig {
  if (!value || typeof value !== "object") {
    return DEFAULT_EDITOR_CONFIG;
  }

  const config = value as {
    textPosition?: Partial<CertificateEditorConfig["textPosition"]>;
    font?: Partial<CertificateEditorConfig["font"]>;
  };

  return {
    textPosition: {
      x: asNumber(config.textPosition?.x, DEFAULT_EDITOR_CONFIG.textPosition.x),
      y: asNumber(config.textPosition?.y, DEFAULT_EDITOR_CONFIG.textPosition.y),
      width: asNumber(config.textPosition?.width, DEFAULT_EDITOR_CONFIG.textPosition.width),
      height: asNumber(config.textPosition?.height, DEFAULT_EDITOR_CONFIG.textPosition.height),
    },
    font: {
      family: asString(config.font?.family, DEFAULT_EDITOR_CONFIG.font.family),
      size: asNumber(config.font?.size, DEFAULT_EDITOR_CONFIG.font.size),
      color: asString(config.font?.color, DEFAULT_EDITOR_CONFIG.font.color),
    },
  };
}

export function buildEditorConfig(input: Partial<LegacyTemplateConfig>): CertificateEditorConfig {
  return normalizeEditorConfig({
    textPosition: {
      x: input.textPositionX,
      y: input.textPositionY,
      width: input.textWidth,
      height: input.textHeight,
    },
    font: {
      family: input.fontFamily,
      size: input.fontSize,
      color: input.fontColor,
    },
  });
}

export function toLegacyTemplateConfig(value: unknown): LegacyTemplateConfig {
  const config = normalizeEditorConfig(value);

  return {
    textPositionX: config.textPosition.x,
    textPositionY: config.textPosition.y,
    textWidth: config.textPosition.width,
    textHeight: config.textPosition.height,
    fontFamily: config.font.family,
    fontSize: config.font.size,
    fontColor: config.font.color,
  };
}

export function attachLegacyTemplateConfig<T extends { editorConfigJson: unknown }>(
  template: T
): T & LegacyTemplateConfig {
  return {
    ...template,
    ...toLegacyTemplateConfig(template.editorConfigJson),
  };
}
