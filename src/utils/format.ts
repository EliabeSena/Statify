export function formatFacingMode(mode?: string): string {
  switch (mode) {
    case "user":
      return "Frontal";
    case "environment":
      return "Traseira";
    case "left":
      return "Esquerda";
    case "right":
      return "Direita";
    default:
      return "Indisponível";
  }
}

// Tbm funciona para WhiteBalanceMode e ExposureMode
export function formatFocusMode(mode?: string): string {
  switch (mode) {
    case "continuous":
      return "Automático contínuo";
    case "single-shot":
      return "Automático (uma vez)";
    case "manual":
      return "Manual";
    case "none":
      return "Foco fixo";
    default:
      return "Indisponível";
  }
}

export function formatEcho(value: boolean | string | undefined): string {
  switch (value) {
    case true:
      return "Sim";
    case false:
      return "Não";
    case "all":
      return "Sim";
    case "remote-only":
      return "Somente áudio remoto";
    default:
      return "Indisponível";
  }
}

export function formatOrientationName(type: OrientationType): string {
  switch (type) {
    case "landscape-primary":
      return "Paisagem";
    case "landscape-secondary":
      return "Paisagem invertida";
    case "portrait-primary":
      return "Retrato";
    case "portrait-secondary":
      return "Retrato invertido";
  }
}