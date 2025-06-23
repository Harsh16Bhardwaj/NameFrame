export interface ThemeConfig {
  dark: ThemeMode;
  light: ThemeMode;
}

export interface ThemeMode {
  background: string;
  sidebar: string;
  card: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  border: string;
  hover: {
    card: string;
    button: string;
  };
  gradient: {
    text: string;
    button: string;
    idk: string;
  };
}

export const themeConfig: ThemeConfig = {
  dark: {
    background: "bg-gradient-to-br from-neutral-900 via-[#1a4345] to-neutral-800",
    sidebar: "bg-gradient-to-b from-[#1a4345] to-[#0f2d2f]",
    card: "bg-[#1a4345]",
    text: {
      primary: "text-[#b0ebeb]",
      secondary: "text-[#8ac1c1]",
      accent: "text-[#50c9c9]"
    },
    border: "border-[#2d5a5c]",
    hover: {
      card: "hover:bg-[#255859]",
      button: "hover:bg-[#2d5a5c]/30"
    },
    gradient: {
      text: "bg-gradient-to-r from-[#50c9c9] to-[#8ac1c1]",
      button: "bg-gradient-to-r from-[#50c9c9] to-[#8ac1c1]",
      idk: "bg-gradient-to-r from-[#0f2d2f] to-[#1a4345]"
    }
  },
  light: {
    background: "bg-gradient-to-br from-[#f0f4ff] via-[#e6e9ff] to-[#f5f7ff]",
    sidebar: "bg-gradient-to-b from-[#e6e9ff] to-[#d6d9ff]",
    card: "bg-white",
    text: {
      primary: "text-[#2a2d42]",
      secondary: "text-[#4b3a70]",
      accent: "text-[#8b7ba1]"
    },
    border: "border-[#d6d9ff]",
    hover: {
      card: "hover:bg-[#f0f4ff]",
      button: "hover:bg-[#e6e9ff]"
    },
    gradient: {
      text: "bg-gradient-to-r from-[#8b7ba1] to-[#6b5b95]",
      button: "bg-gradient-to-r from-[#8b7ba1] to-[#6b5b95]",
      idk: "bg-gradient-to-r from-[#eaebff] to-[#f0f4fg]"
    }
  }
};