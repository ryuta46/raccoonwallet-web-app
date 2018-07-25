
export class Environment {
  // Detects if device is on iOS
// Detects if device is in standalone mode
  static isIos(): boolean {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }

  static isInStandaloneMode(): boolean {
    return ('standalone' in window.navigator) && ((window.navigator as any).standalone);
  }
}
