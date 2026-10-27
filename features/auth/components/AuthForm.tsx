import React from "react";
import AuthSidebar from "@/features/auth/components/AuthSidebar";
import LoginForm from "@/features/auth/components/LoginForm";
import "../auth-login.css";

import taramedicLoginBackgroundDesktop from "@/public/images/BG-Tampilan-Desktop.jpeg";
import taramedicLoginBackgroundMobile from "@/public/images/BG-Tampilan-Mobile-Rev.jpeg";
import taramedicLogo from "@/public/logo/taramedic-logo.png";

function TaramedicBrandStory() {
  return (
    <aside className="taramedic-login__story" aria-label="Tentang TARAMEDIC">
      <div className="taramedic-login__brand">
        <img
          src={taramedicLogo.src}
          alt="TARAMEDIC — Excellent Medical IT Partner"
          className="taramedic-login__logo"
        />
      </div>
      <div className="taramedic-login__story-copy">
        <h1>
          Sistem Informasi Manajemen
          <br />
          Klinik Terintegrasi (SIMKT)
        </h1>
        <p>
          Menghubungkan pelayanan dan operasional Klinik dalam satu ekosistem
        </p>
      </div>
    </aside>
  );
}

function TaramedicLoginBackground() {
  return (
    <picture className="taramedic-login__background" aria-hidden="true">
      <source
        media="(max-width: 767px)"
        srcSet={taramedicLoginBackgroundMobile.src}
      />
      <img
        className="taramedic-login__background-image"
        src={taramedicLoginBackgroundDesktop.src}
        alt=""
      />
    </picture>
  );
}

const LoginPage = () => {
  const [setup, setSetup] = React.useState<{ available: boolean } | null>(null);

  return (
    <main className="taramedic-login">
      <TaramedicLoginBackground />
      <div
        className={`taramedic-login__layout${setup?.available ? "" : " taramedic-login__layout--signin"}`}
      >
        <TaramedicBrandStory />
        <section
          className={`taramedic-login__access${setup?.available ? "" : " taramedic-login__access--signin"}`}
          aria-label="Masuk ke TARAMEDIC"
        >
          <div
            className={`taramedic-login__access-inner${setup?.available ? "" : " taramedic-login__access-inner--signin"}`}
          >
            <div className="taramedic-login__form-wrap">
              <div
                className={`taramedic-login__form-heading${setup?.available ? "" : " taramedic-login__form-heading--signin"}`}
              >
                <span className="taramedic-login__form-kicker">
                  {setup?.available ? "PENYIAPAN AKUN" : "PORTAL KLINIK"}
                </span>
                <h2>
                  {setup?.available
                    ? "Siapkan super-admin"
                    : "Selamat Datang di Taramedic"}
                </h2>
                <p>
                  {setup?.available
                    ? "Buat kata sandi baru untuk mengaktifkan akses administrator klinik."
                    : "Sistem informasi manajemen klinik terintegrasi."}
                </p>
              </div>

              {setup?.available ? <LoginForm /> : <LoginForm />}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
