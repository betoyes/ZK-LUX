{ pkgs }: {
  deps = [
    pkgs.nodejs

    # libs que resolvem libglib-2.0.so.0 e dependências comuns do Playwright
    pkgs.glib
    pkgs.nss
    pkgs.nspr
    pkgs.atk
    pkgs.cups
    pkgs.dbus
    pkgs.expat
    pkgs.pango
    pkgs.cairo

    pkgs.xorg.libX11
    pkgs.xorg.libXcomposite
    pkgs.xorg.libXdamage
    pkgs.xorg.libXext
    pkgs.xorg.libXfixes
    pkgs.xorg.libXrandr
    pkgs.xorg.libxcb

    pkgs.mesa
    pkgs.alsa-lib
    pkgs.libdrm
    pkgs.libgbm

    pkgs.glib

  ];
}
