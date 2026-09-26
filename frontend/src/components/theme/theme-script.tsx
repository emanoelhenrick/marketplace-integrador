const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("manoa-theme");
    var systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    var isDark = stored ? stored === "dark" : systemPrefersDark;

    document.documentElement.classList.toggle("dark", isDark);
  } catch (error) {
    // Ambiente sem acesso a localStorage/matchMedia: mantém o tema claro.
  }
})();
`;

export function ThemeScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
  );
}
