"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearUser, getUser, type User } from "@/lib/session";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUserState] = useState<User>(null);

  useEffect(() => {
    setUserState(getUser());
  }, [pathname]);

  const isActive = (name: "biblioteca" | "salon" | "auth") => {
    if (name === "biblioteca") {
      return (
        pathname === "/" ||
        pathname.startsWith("/juegos")
      );
    }
    if (name === "salon") return pathname === "/salon-de-la-fama";
    return pathname === "/auth";
  };

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleSignOut = () => {
    clearUser();
    setUserState(null);
  };

  return (
    <>
      <nav className="av-nav">
        <div className="logo" onClick={() => go("/")}>
          <div className="logo-mark"></div>
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </div>
        <div className="links">
          <Link href="/" className={isActive("biblioteca") ? "active" : ""}>
            Biblioteca
          </Link>
          <Link
            href="/salon-de-la-fama"
            className={isActive("salon") ? "active" : ""}
          >
            Salón de la Fama
          </Link>
        </div>
        <div className="spacer"></div>
        <div className="coin-counter">
          <span className="coin"></span>
          <span>CRÉDITOS · 03</span>
        </div>
        {user ? (
          <button className="btn ghost auth-btn" onClick={handleSignOut}>
            {user.name} ▾
          </button>
        ) : (
          <button className="btn auth-btn" onClick={() => go("/auth")}>
            Iniciar Sesión
          </button>
        )}
        <button
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menú"
        >
          ≡
        </button>
      </nav>

      <div
        className={"av-mobile-backdrop" + (open ? " open" : "")}
        onClick={() => setOpen(false)}
      ></div>
      <aside className={"av-mobile-panel" + (open ? " open" : "")}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
          MENÚ
        </div>
        <a
          className={isActive("biblioteca") ? "active" : ""}
          onClick={() => go("/")}
        >
          Biblioteca
        </a>
        <a
          className={isActive("salon") ? "active" : ""}
          onClick={() => go("/salon-de-la-fama")}
        >
          Salón de la Fama
        </a>
        <a
          className={isActive("auth") ? "active" : ""}
          onClick={() => go("/auth")}
        >
          {user ? "Cuenta" : "Iniciar Sesión"}
        </a>
        <div style={{ flex: 1 }}></div>
        <div
          className="pixel"
          style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}
        >
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  );
}
