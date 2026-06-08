"use client";

import {
  useCallback,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
} from "lucide-react";

import "@/style/login-page.css";

export default function Page() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const router = useRouter();

  const handleLogin =
    useCallback(
      async (
        e: FormEvent<HTMLFormElement>
      ) => {
        e.preventDefault();

        setError("");
        setIsLoading(true);

        window.setTimeout(() => {
          const isValidUser =
            username === "iyaz" &&
            password === "123";

          if (isValidUser) {
            router.push(
              "/dashboard"
            );
            return;
          }

          setError(
            "Username atau password salah"
          );

          setIsLoading(false);
        }, 1200);
      },
      [
        username,
        password,
        router,
      ]
    );

  return (
    <div className="simakLogin__wrapper">

      <div className="simakLogin__card">

        <div className="simakLogin__header">

          <h1 className="simakLogin__title">
            SIMAK
          </h1>

          <p className="simakLogin__subtitle">
            Sistem Informasi
            Management dan
            Administratif KII
          </p>

        </div>

        <form
          className="simakLogin__form"
          onSubmit={handleLogin}
        >

          {/* Username */}

          <div className="simakLogin__field">

            <label className="simakLogin__label">
              Username
            </label>

            <div className="simakLogin__inputWrapper">

              <input
                type="text"
                placeholder="Masukkan username"
                className="simakLogin__input"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                disabled={isLoading}
              />

            </div>

          </div>

          {/* Password */}

          <div className="simakLogin__field">

            <label className="simakLogin__label">
              Password
            </label>

            <div className="simakLogin__inputWrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                className="simakLogin__input"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                disabled={isLoading}
              />

              <button
                type="button"
                className="simakLogin__inputIcon"
                disabled={isLoading}
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="simakLogin__error">
              {error}
            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={isLoading}
            className={`simakLogin__button ${
              isLoading
                ? "simakLogin__button--loading"
                : ""
            }`}
          >
            {isLoading ? (
              <>
                <Loader2
                  size={18}
                  className="simakLogin__spinner"
                />

                <span>
                  Memproses...
                </span>
              </>
            ) : (
              <>
                <LogIn size={18} />

                <span>
                  Masuk
                </span>
              </>
            )}
          </button>

          <div className="simakLogin__footer">
            ©{" "}
            {new Date().getFullYear()}{" "}
            KII Company
          </div>

        </form>

      </div>

    </div>
  );
}